/*
 * Copyright INRAE
 * Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
 * MyChoice is a web application supporting collective decision.
 * See more on https://ico.iate.inra.fr/MyChoice
 * This application is registered to the European organization for the
 * protection of authors and publishers of digital creations with
 * the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900
 *
 * This software is governed by the CeCILL-C license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL-C
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL-C license and that you accept its terms.
 */
package fr.inra.MyChoice.dao.write;

import java.lang.invoke.MethodHandles;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.inra.MyChoice.dao.Dao;
import fr.inra.MyChoice.dao.read.ReadDaoJDBC;
import fr.inra.MyChoice.exception.FunctionalException;
import fr.inra.MyChoice.util.ColumnMapper;
public class WriteDaoJDBC extends Dao implements WriteDao {

	private Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getName());
	Connection cn = null;
	private ColumnMapper hash;

	public WriteDaoJDBC() {
		super();
		hash = new ColumnMapper();
	}

	/**
	 * crée une requete pour verifier l'existance d'une valeur dans une table
	 * 
	 * @param table
	 * @param colName
	 * @param line
	 * @param i
	 * @return
	 * @throws FunctionalException
	 */
	public void insertQueryMaker(String table, String col, ArrayList<String> array, String projet)
			throws FunctionalException {

		ReadDaoJDBC read = new ReadDaoJDBC();

		WriteDaoJDBC jdbc = new WriteDaoJDBC();

		ArrayList<Integer> foreignKey = new ArrayList<Integer>();

		String queryHead = "INSERT INTO " + table + "\r\n(";

		String query = queryHead;

		String[] colName = col.split(";");

		boolean wantId = table.equals("argument");

		ArrayList<String> colonne = read.getColumnName(table, wantId);

		for (int i = 0; i < colName.length; i++) {
			if (colName[i].indexOf(".") != -1) {
				String temp = colName[i].substring(0, colName[i].indexOf("."));
				if (!temp.equals(table)) {
					foreignKey.add(i);
				}

			}
		}

		query = queryHead;

		for (int i = 0; i < colonne.size(); i++) {
			query += colonne.get(i) + ", ";

		}

		query = query.substring(0, query.length() - 2);
		query += ")\r\n";

		query += "VALUES";

		if (array.size() != 0) {

			for (int j = 0; j < array.size(); j++) {
				String sentQuery = query;
				sentQuery += " (";

				String[] line = array.get(j).split(";");

				String specialValue = ".";

				for (int i = colonne.size(); i < line.length; i++) {
					specialValue += line[i] + ".";
				}

				for (int i = 0; i < line.length && i < colonne.size(); i++) {
					if (line[i].equals("")) {
						sentQuery += "NULL, ";
					} else {
						if (foreignKey.contains(i)) {

							sentQuery += read.getPrimary(colName[i] + specialValue, line[i], projet) + ", ";

						} else {
							sentQuery += "\"" + line[i] + "\", ";
						}
					}
				}

				if (table.equals("alternative")) {
					sentQuery += read.getPrimary("project.nameProject", projet, projet) + ", ";
				}
				sentQuery = sentQuery.substring(0, sentQuery.length() - 2);
				sentQuery += ");\r\n";
				log.debug(sentQuery);

				jdbc.putProject(sentQuery);

			}

		}

	}

	public void superQueryMaker(String table, String col, ArrayList<String> array, String projet)
			throws FunctionalException {

		ColumnMapper hash = new ColumnMapper();

		ReadDaoJDBC read = new ReadDaoJDBC();

		WriteDaoJDBC jdbc = new WriteDaoJDBC();

		ArrayList<Integer> foreignKey = new ArrayList<Integer>();

		String queryHead = "INSERT INTO " + table + "\r\n(";

		String query = queryHead;

		String[] colName = col.split(";");

		int date = -1;

		int nbCol = colName.length;

		if (table.equals("argument")) {
			nbCol = nbCol - 2;
		}

		ArrayList<Integer> checkForComa = new ArrayList<Integer>();

		for (int i = 0; i < nbCol; i++) {
			if (colName[i].indexOf("date") != -1) {
				date = i;
			}

			if (colName[i].indexOf("infValue") != -1 || colName[i].indexOf("supValue") != -1) {
				checkForComa.add(i);
			}

			if (colName[i].indexOf(".") != -1) {
				String temp = hash.contains(colName[i]);
				if (temp == null) {
					throw new FunctionalException("can't find col name");
				}
				foreignKey.add(i);
				queryHead += temp + ", ";
			} else {
				queryHead += colName[i] + ", ";
			}
		}

		query = queryHead;

		query = query.substring(0, query.length() - 2);
		query += ")\r\n";

		log.debug(query);

		query += "VALUES";

		if (array.size() != 0) {

			for (int j = 0; j < array.size(); j++) {
				String sentQuery = query;
				sentQuery += " (";

				String[] line = array.get(j).split(";");
				for (int i = 0; i < line.length; i++) {
					line[i] = escapeQuote(line[i]);
				}

				if (!table.equals("argument") && read.checkIfExist(table + "." + colName[0], line[0]) != -1) {
					log.warn(WARNING_DUPLICATE);
				} else {

					String specialValue = ".";

					for (int i = nbCol; i < line.length; i++) {
						specialValue += line[i] + ".";
					}

					for (int i = 0; i < line.length && i < nbCol; i++) {

						if (date == i && !line[i].equals("")) {
							// line[i]= formatDate(line[i]);
							// format dans le CSV : DD/MM/AA
							// format base de données : AAAA/MM/JJ
							line[i] = "DATE_FORMAT('" + line[i] + "', '%d/%m/%y')";
							// line[i] = "2019/12/02";
						}

						if (checkForComa.contains(i) && line[i].indexOf(",") != -1) {
							line[i] = line[i].replace(",", ".");
						}

						if (line[i].equals("")) {
							sentQuery += "NULL, ";
						} else {
							if (foreignKey.contains(i)) {

								sentQuery += read.getPrimary(colName[i] + specialValue, line[i], projet) + ", ";

							} else {
								if (date != i) {
									sentQuery += "\"" + line[i] + "\", ";
								}else{
									sentQuery += line[i] + ", ";
								}
							}
						}
					}

					if (table.equals("alternative")) {
						sentQuery += read.getPrimary("project.nameProject", projet, projet) + ", ";
					}
					sentQuery = sentQuery.substring(0, sentQuery.length() - 2);
					sentQuery += ");\r\n";
					log.debug(sentQuery);

					jdbc.putProject(sentQuery);

				}
			}

		}

	}

	public String escapeQuote(String query) {
		return query.replace("\"", "\\\"");
	}

	private String formatDate(String string) {

		String[] valeur;
		String retour = "";
		if (string.indexOf("-") != -1) {
			valeur = string.split("-");
			String temp = valeur[0];
			valeur[0] = valeur[2];
			valeur[2] = temp;

			// retour = valeur[0]+"-"+valeur[1]+"-"+valeur[2];
			retour = valeur[0] + "-" + valeur[2] + "-" + valeur[1];
		}

		if (string.indexOf("/") != -1) {
			valeur = string.split("/");
			String temp = valeur[0];
			valeur[0] = valeur[2];
			valeur[2] = temp;

			// retour = valeur[0]+"-"+valeur[1]+"-"+valeur[2];
			retour = valeur[0] + "-" + valeur[2] + "-" + valeur[1];
		}

		log.debug("Date : " + retour);

		return retour;
	}

	public int insertValue(String colAndTableName, String value, String projet) throws FunctionalException {

		ReadDaoJDBC read = new ReadDaoJDBC();

		String[] table = colAndTableName.split("\\.");

		String query = "INSERT INTO " + table[0] + " \r\n";
		ArrayList<String> array = read.getColumnName(table[0], false);
		query += " (";

		for (int i = 0; i < array.size(); i++) {
			query += array.get(i) + ", ";
		}

		query = query.substring(0, query.length() - 2);
		query += ")\r\n VALUES(\"" + value + "\", ";

		for (int i = 1; i < array.size(); i++) {
			query += " NULL, ";
		}

		switch (table[0]) {

		case "aim":

			query = query.substring(0, query.length() - 7);
			int prim = read.getPrimary("criterion.nameCriterion", table[2], projet);
			if (prim == -1) {
				prim = insertValue("criterion.nameCriterion", table[2], projet);
			}
			query += prim + ", ";

			break;

		case "source":
			query = query.substring(0, query.length() - 7);
			int primary = read.getPrimary("typesource.nameTypeSource", table[3], projet);
			if (primary == -1) {
				prim = insertValue("typesource.nameTypeSource", table[3], projet);
			}
			query += primary + ", ";

			break;

		case "alternative":
			query = query.substring(0, query.length() - 7);
			query += read.getPrimary("project.nameProject", projet, projet) + ", ";

			break;

		case "project":
			throw new FunctionalException(ERROR_PROJECT_DOES_NOT_EXIST);

		}

		query = query.substring(0, query.length() - 2);
		query += ");";

		log.debug(query);

		this.putProject(query);

		return read.getPrimary(colAndTableName, value, projet);

	}

	/**
	 * exécute une insertion
	 * 
	 * @param cnx
	 * @param sql
	 * @return
	 */
	protected int execInsert(Connection cnx, String sql) {
		int results = -1;
		Statement st = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			st = cnx.createStatement();

			results = st.executeUpdate(sql);

		} catch (Exception e) {
			log.error(ERROR_SQL_QUERY, e);

		}
		return results;

	}

	/**
	 * établie une connexion avec une base de donnée, puis insére un élement
	 * 
	 * @param query
	 */
	public void putProject(String query) {
		Connection cnx = null;

		try {
			cnx = getConnection();
			execInsert(cnx, query);

		} catch (SQLException e) {
			log.error(ERROR_INSERT_ELEMENT, e);

		} finally {
			try {
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}
	}

	public void insertWithDoublePrimaryKey(String table, String col, ArrayList<String> array, String projet) {

		ReadDaoJDBC read = new ReadDaoJDBC();

		String queryHead = "INSERT INTO " + table + " \r\n(";

		ArrayList<String> colName = read.getColumnName(table, true);

		for (int i = 0; i < colName.size(); i++) {
			queryHead += colName.get(i) + ", ";
		}

		String[] colonne = col.split(";");

		ArrayList<Integer> foreignKey = new ArrayList<Integer>();

		for (int i = 0; i < colonne.length; i++) {
			int index = colonne[i].indexOf(".");
			if (index != -1) {
				String temp = colonne[i].substring(0, index);
				if (!temp.equals(table)) {
					foreignKey.add(i);
				}
			}
		}

		for (int j = 0; j < array.size(); j++) {
			if (read.checkIfExistDoubleKey(table, array.get(j))) {

			}
			String[] values = array.get(j).split(";");

			String query = queryHead;

			query = query.substring(0, query.length() - 2) + ")\r\nVALUES(";

			for (int i = 0; i < values.length; i++) {
				if (foreignKey.contains(i)) {
					try {
						query += read.getPrimary(colonne[i], values[i], projet) + ", ";
					} catch (FunctionalException e) {
						e.printStackTrace();
					}

				} else {
					query += values[i] + ", ";
				}
			}

			query = query.substring(0, query.length() - 2) + ");";
			this.putProject(query);
		}
	}

}
