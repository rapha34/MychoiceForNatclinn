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
package fr.inra.MyChoice.dao.read;

import java.lang.invoke.MethodHandles;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.inra.MyChoice.dao.Dao;
import fr.inra.MyChoice.dao.write.WriteDaoJDBC;
import fr.inra.MyChoice.exception.FunctionalException;
import fr.inra.MyChoice.model.AlternativeDescription;
import fr.inra.MyChoice.model.Argument;
import fr.inra.MyChoice.model.HasExpertise;
import fr.inra.MyChoice.model.Project;
import fr.inra.MyChoice.model.TypeSource;
import fr.inra.MyChoice.util.ColumnMapper;

public class ReadDaoJDBC extends Dao implements ReadDao {

	private Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getName());
	private ColumnMapper hash;

	private static String NAME_STAKEHOLDER = "nameStakeholder";
	private static String NAME_CRITERION = "nameCriterion";

	public ReadDaoJDBC() {
		super();
		hash = new ColumnMapper();
	}

	protected String buildSelectIdQuery(String colAndTableName, String value) {
		return buildSelectIdQuery("id", colAndTableName, value);
	}

	/**
	 * Return a SQL query used to retrieve primary keys
	 * 
	 * @param idColumnName
	 * @param colAndTableName
	 * @param value
	 * @return
	 */
	protected String buildSelectIdQuery(String idColumnName, String colAndTableName, String value) {

		String[] table = colAndTableName.split("\\.");

		String select = "SELECT " + idColumnName + table[0].substring(0, 1).toUpperCase() + table[0].substring(1)
				+ " FROM " + table[0] + " WHERE " + table[1] + " = \"" + value + "\" ; ";

		return select;
	}

	public static String COL_NB = "nb";
	public static String COL_ID = "id";
	private static String DUPLICATE_ENTRY = "Plusieurs valeurs trouvées pour un même identifiant ";

	public int checkIfExist(String colAndTableName, String value) throws FunctionalException {
		return checkIfExist(COL_ID, colAndTableName, value);
	}

	/**
	 * 
	 * Retourne la valeur de la clef primaire d'un élément, retourne -1 si il
	 * n'existe pas
	 * 
	 * @param idColumnName
	 * @param colAndTableName
	 * @param value
	 * @return
	 * @throws FunctionalException
	 */
	public int checkIfExist(String idColumnName, String colAndTableName, String value) throws FunctionalException {
		String sqlQuery;
		Connection cnx = null;
		ResultSet result = null;
		int num = -1;
		try {
			cnx = getConnection();
			sqlQuery = buildSelectIdQuery(idColumnName, colAndTableName, value);
			result = execSelectQuery(cnx, sqlQuery);
			num = readIdentifier(idColumnName, colAndTableName, value, result);
		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PRIMARY_KEY, e);
		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}
		return num;
	}

	public int getPrimary(String colAndTableName, String value, String projet) throws FunctionalException {
		return getPrimary(COL_ID, colAndTableName, value, projet);
	}

	/**
	 * retourne la clef primaire d'un élément, si il n'existe pas, l'élément est
	 * alors crée
	 * 
	 * @param idColumnName
	 * @param colAndTableName
	 * @param value
	 * @return
	 * @throws FunctionalException
	 */
	public int getPrimary(String idColumnName, String colAndTableName, String value, String projet)
			throws FunctionalException {

		WriteDaoJDBC write = new WriteDaoJDBC();

		String sqlQuery;
		Connection cnx = null;
		ResultSet result = null;
		int num = -1;
		try {
			cnx = getConnection();
			sqlQuery = buildSelectIdQuery(idColumnName, colAndTableName, value);
			result = execSelectQuery(cnx, sqlQuery);
			num = readIdentifier(idColumnName, colAndTableName, value, result);
			if (num == -1) {
				num = write.insertValue(colAndTableName, value, projet);

			}
		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PRIMARY_KEY, e);
		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}
		return num;
	}

	/**
	 * verifie et retourne la clef primaire d'un élément, retourne -1 si il n'existe
	 * pas
	 * 
	 * @param idColumnName
	 * @param colAndTableName
	 * @param value
	 * @return
	 * @throws SQLException
	 * @throws FunctionalException
	 */
	protected int readIdentifier(String idColumnName, String colAndTableName, String value, ResultSet result)
			throws SQLException, FunctionalException {
		int num = -1;
		if (result.first()) {
			num = result.getInt(1);
		}
		if (result.next()) {
			result.close();
			throw new FunctionalException(DUPLICATE_ENTRY + idColumnName + " " + colAndTableName + " id : " + value);
		} else {
			result.close();
		}
		return num;
	}

	/**
	 * retourne une liste contenant l'ensemble des colonnes d'une table en question
	 * 
	 * @param r
	 * @param wantId
	 * @return
	 * @throws SQLException
	 */
	protected ArrayList<String> fillColumn(ResultSet r, boolean wantId) throws SQLException {
		ArrayList<String> colonne = new ArrayList<String>();
		if (!wantId) {
			r.next();
		}
		while (r.next()) {
			colonne.add(r.getString(1));
		}

		return colonne;
	}

	/**
	 * crée, execute et retourne le résultat d'une requete qui retourne les colonnes
	 * d'une table
	 * 
	 * @param table
	 * @param wantId
	 * @return
	 */
	public ArrayList<String> getColumnName(String table, boolean wantId) {

		String sqlQuery;
		Connection cnx = null;
		ResultSet result = null;
		ArrayList<String> colonne = new ArrayList<String>();
		this.hash.getArgumentMappingToCSV();
		try {
			cnx = getConnection();
			sqlQuery = "DESCRIBE " + table + " ; ";
			result = execSelectQuery(cnx, sqlQuery);
			colonne = fillColumn(result, wantId);

		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_COLUMN_NAME, e);
		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}

		return colonne;
	}

	protected ResultSet execPreparedStatement(Connection cnx, String sql, String value) {
		ResultSet results = null;
		PreparedStatement st = null;
		try {
			st = cnx.prepareStatement(sql);
			st.setString(1, value);
			st.execute();
			results = st.getResultSet();
		} catch (Exception e) {
			log.error(ERROR_SQL_QUERY, e);
		}
		return results;

	}

	/**
	 * Execute une requete SQL SELECT
	 * 
	 * @param cnx, sql
	 * @return results
	 */
	protected ResultSet execSelectQuery(Connection cnx, String sql) {
		ResultSet results = null;
		Statement st = null;
		try {
			st = cnx.createStatement();
			results = st.executeQuery(sql);
		} catch (Exception e) {
			log.error(ERROR_SQL_QUERY, e);
		}
		return results;

	}

	/**
	 * Retourne l'id du projet dont le nom est passé en paramètre
	 * 
	 * @param cnx
	 * @param projectName
	 * @return
	 */
	public int getProjetIdentifier(Connection cnx, String projectName) {
		ResultSet result;
		int id = -1;
		result = execSelectQuery(cnx, "select idProject from project where nameProject = '" + projectName + "';");
		try {
			while (result.next()) {
				id = result.getInt("idProject");
			}
			result.close();
		} catch (SQLException e) {
			log.error(ERROR_SQL_QUERY, e);
		}
		return id;

	}

	/**
	 * Génère une requete sql pour récupérer les informations du projet et l'execute
	 * sur la base
	 * 
	 * @throws FunctionalException
	 */
	@Override
	public Project getProject(String projectName) throws FunctionalException {
		String sqlQuery;
		Connection cnx = null;
		ResultSet result = null;
		Project project = null;
		try {
			cnx = getConnection();
			sqlQuery = buildQuery();
			result = execPreparedStatement(cnx, sqlQuery, projectName);
			if (!result.first()) {
				closeResultSet(result);
				releaseConnection(cnx);
				throw new FunctionalException(ERROR_UNKNOWN_PROJECT);
			}
			project = fillProject(result);
			closeResultSet(result);

			result = execPreparedStatement(cnx, buildQueryHasExpertise(), projectName);
			fillExpertise(result, project);
			closeResultSet(result);

			result = execSelectQuery(cnx, buildQueryTypeSource());
			fillTypeSource(result, project);
			closeResultSet(result);

		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PROJECT, e);
		} finally {
			try {
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}
		return project;
	}

	private static String NAME_TYPE_SOURCE = "nameTypeSource";
	private static String NAME_FIABILITY = "fiability";

	private void fillTypeSource(ResultSet result, Project project) throws SQLException {
		String nameTypeSource;
		String fiability;
		while (result.next()) {
			nameTypeSource = result.getString(NAME_TYPE_SOURCE);
			fiability = result.getString(NAME_FIABILITY);
			project.addTypeSource(new TypeSource(nameTypeSource, fiability));
		}
	}

	private void fillExpertise(ResultSet result, Project project) throws SQLException {
		String nameStakeHolder;
		String nameCriterion;
		while (result.next()) {
			nameStakeHolder = result.getString(NAME_STAKEHOLDER);
			nameCriterion = result.getString(NAME_CRITERION);
			project.addExpertise(new HasExpertise(nameStakeHolder, nameCriterion));
		}
	}

	public ArrayList<Argument> getArguments(String projectName) {
		String sqlQuery;
		sqlQuery = buildQueryArgument();
		Connection cnx = null;
		ResultSet result = null;
		ArrayList<Argument> array = null;
		try {
			cnx = getConnection();
			result = execPreparedStatement(cnx, sqlQuery, projectName);
			array = fillArgument(result);
		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PROJECT, e);

		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}

		return array;
	}

	public ArrayList<Argument> getArguments(String projectName, String[] tab, String[] tableau, String[] tabCriterion) {
		String sqlQuery;
		sqlQuery = buildQueryArgument(projectName, tab, tableau, tabCriterion);
		Connection cnx = null;
		ResultSet result = null;
		ArrayList<Argument> array = null;
		try {
			cnx = getConnection();
			result = execSelectQuery(cnx, sqlQuery);
			array = fillArgument(result);
		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PROJECT, e);

		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}

		return array;
	}

	public static final int COL_ID_ARGUMENT = 1;
	public static final int COL_NAME_STAKEHOLDER = 2;
	public static final int COL_NAME_ALTERNATIVE = 3;
	public static final int COL_TYPE_PROCON = 4;
	public static final int COL_NAME_PROPERTY = 5;
	public static final int COL_DATE = 6;
	public static final int COL_DESCRIPTION = 7;
	public static final int COL_ASSERTION = 8;
	public static final int COL_EXPLANATION = 9;
	public static final int COL_QUALVALUE = 10;
	public static final int COL_NAME_SOURCE = 11;
	public static final int COL_NAME_CRITERION = 12;
	public static final int COL_OBTENTION = 13;
	public static final int COL_NAME_TYPE_SOURCE = 14;
	public static final int COL_NAME_IS_PROSPECTIVE = 15;
	public static final int COL_CONDITION = 16;

	// public static final int COL_NAME_STAKEHOLDER_AVI = 15;
	// public static final int COL_TYPE_LIKEDISLIKE = 16;

	/**
	 * Retourne une liste d'argument initialisé à partir du resultset en parametre
	 * 
	 * @param results
	 * @return array
	 */
	protected ArrayList<Argument> fillArgument(ResultSet results) {
		ArrayList<Argument> array = new ArrayList<Argument>();
		try {
			while (results.next()) {
				Boolean proCon = results.getString(COL_TYPE_PROCON).contentEquals("+");

				Argument argument;

				argument = new Argument(results.getInt(COL_ID_ARGUMENT), results.getString(COL_ASSERTION),
						results.getString(COL_EXPLANATION), proCon, results.getString(COL_NAME_PROPERTY),
						results.getString(COL_QUALVALUE),
						(results.getString(COL_NAME_SOURCE) + " " + results.getString(COL_OBTENTION) + " "
								+ results.getString(COL_NAME_TYPE_SOURCE)),
						results.getString(COL_DATE), results.getString(COL_DESCRIPTION),
						results.getString(COL_NAME_CRITERION), results.getString(COL_NAME_ALTERNATIVE),
						results.getString(COL_NAME_STAKEHOLDER), results.getString(COL_NAME_TYPE_SOURCE),
						results.getString(COL_NAME_IS_PROSPECTIVE));
				argument.setCondition(results.getString(COL_CONDITION));
				array.add(argument);
			}
		} catch (Exception e) {
			log.error(ERROR_RETRIEVE_ARGUMENTS, e);
		}
		return array;
	}

	/**
	 * Retourne un objet projet initialisé a partir du resultset en parametre
	 * 
	 * @param result
	 * @return
	 * @throws SQLException
	 */
	private Project fillProject(ResultSet results) throws SQLException {

		ArrayList<String> criterion = new ArrayList<String>();
		ArrayList<String> aim = new ArrayList<String>();
		ArrayList<String> stakeholder = new ArrayList<String>();
		ArrayList<String> checkAlternative = new ArrayList<String>();
		ArrayList<AlternativeDescription> alternative = new ArrayList<AlternativeDescription>();
		String name = null;
		String image = null;
		String description = null;

		while (results.next()) {
			description = results.getString(10);
			name = results.getString(1);
			image = results.getString(7);
			if (!aim.contains(results.getString(2))) {
				aim.add(results.getString(2));
			}
			if (!stakeholder.contains(results.getString(3))) {
				stakeholder.add(results.getString(3));
			}

			if (!criterion.contains(results.getString(4))) {
				criterion.add(results.getString(4));
			}

			if (!checkAlternative.contains(results.getString(5))) {
				checkAlternative.add(results.getString(5));
				alternative.add(new AlternativeDescription(results.getString(5), results.getString(6),
						results.getString(8), results.getString(9)));
			}
		}

		return new Project(name, description, image, stakeholder, aim, criterion, alternative);
	}

	private String buildQueryHasExpertise() {
		String query;
		query = "select s.nameStakeholder, c.nameCriterion from hasexpertise "
				+ "join stakeholder s on hasexpertise.numStakeholder = s.idStakeholder "
				+ "join criterion c on hasexpertise.numCriterion = c.idCriterion "
				+ "join project p on hasexpertise.numProject = p.idProject " + "where p.nameProject = ?";
		return query;
	}

	private String buildQueryTypeSource() {
		return "select nameTypeSource, fiability from typesource";
	}

	/**
	 * Génère une requete SQL récupérant les informations du projet
	 * 
	 * @param projectName
	 * @return
	 */
	private String buildQuery() {
		String query;
		query = "SELECT DISTINCT nameProject, A.description, nameStakeholder, nameCriterion, nameAlternative, alt.description, image, alt.imageAlternative, alt.iconAlternative, project.description \r\n"
				+ "FROM `project`\r\n" + "LEFT OUTER JOIN `alternative` AS alt ON alt.numProject=idProject\r\n"
				+ "LEFT OUTER JOIN `argument` ON numAlternative = idAlternative\r\n"
				+ "LEFT OUTER JOIN `aim` AS A ON numAIm = A.idAim\r\n"
				+ "LEFT OUTER JOIN `stakeholder` ON numStakeholder = idStakeholder\r\n"
				+ "LEFT OUTER JOIN `criterion` ON numCriterion = idCriterion\r\n" + "WHERE nameProject=?";
		return query;
	}

	private String buildQueryArgument() {
		String where = "WHERE nameProject = ?";
		String sql = "SELECT idArgument, s.nameStakeholder,nameAlternative,typeProCon,nameProperty,\r\n"
				+ "DATE_FORMAT(Arg.date, '%d/%m/%y'), A.description , assertion, explanation,qualValue, nameSource, \r\n"
				+ "nameCriterion,obtention, T.nameTypeSource, isProspective, Arg.condition \r\n"
				+ "FROM `argument` AS Arg\r\n" + "JOIN `aim` As A ON A.idAim = Arg.numAim \r\n"
				+ "JOIN `criterion` As c ON A.numCriterion = c.idCriterion \r\n"
				+ "JOIN `alternative` As alt ON alt.idAlternative =  Arg.numAlternative  \r\n"
				+ "JOIN `stakeholder` AS s ON s.idStakeholder = Arg.numStakeholder\r\n"
				+ "JOIN `qualvalue` AS l ON l.idQualValue = Arg.numQualValue\r\n"
				+ "JOIN `source` AS so ON so.idSource = Arg.numSource\r\n"
				+ "JOIN `property` AS p ON p.idProperty = Arg.numProperty \r\n"
				+ "JOIN `typesource` AS T ON T.idTypeSource=so.numTypeSource \r\n"
				+ "JOIN `project` AS Pr ON Pr.idProject=alt.numProject \r\n" + "\r\n" + where + "\r\n"
				+ " ORDER BY Arg.idArgument";

		sql += ";";
		return sql;

	}

	/**
	 * Génère une requete SQL récupérant les arguments du projet
	 * 
	 * @param projectName, tab ,tableau, tabCriterion
	 * @return sql
	 */
	private String buildQueryArgument(String projectName, String[] tab, String[] tableau, String[] tabCriterion) {

		String where = "WHERE nameProject = '" + projectName + "' ";

		if (tab.length != 0 && tab[0].length() != 0) {
			for (int i = 0; i < tab.length; i++) {
				where += " AND s.nameStakeholder != \"" + tab[i] + "\"";
			}
		}

		if (tableau.length != 0 && tableau[0].length() != 0) {
			for (int i = 0; i < tableau.length; i++) {
				where += " AND  A.description != \"" + tableau[i] + "\"";
			}
		}

		if (tabCriterion.length != 0 && tabCriterion[0].length() != 0) {
			for (int i = 0; i < tabCriterion.length; i++) {
				where += " AND c.nameCriterion != \"" + tabCriterion[i] + "\"";
			}
		}

		String sql = "SELECT idArgument, s.nameStakeholder,nameAlternative,typeProCon,nameProperty,\r\n"
				+ "Arg.date, A.description , assertion, explanation,qualValue, nameSource, \r\n"
				+ "nameCriterion,obtention,nameTypeSource \r\n" + "FROM `argument` AS Arg\r\n"
				+ "JOIN `aim` As A ON A.idAim = Arg.numAim \r\n"
				+ "JOIN `criterion` As c ON A.numCriterion = c.idCriterion \r\n"
				+ "JOIN `alternative` As alt ON alt.idAlternative =  Arg.numAlternative  \r\n"
				+ "JOIN `stakeholder` AS s ON s.idStakeholder = Arg.numStakeholder\r\n"
				+ "JOIN `qualvalue` AS l ON l.idQualValue = Arg.numQualValue\r\n"
				+ "JOIN `source` AS so ON so.idSource = Arg.numSource\r\n"
				+ "JOIN `property` AS p ON p.idProperty = Arg.numProperty \r\n"
				+ "JOIN `typesource` AS T ON T.idTypeSource=so.numTypeSource \r\n"
				+ "JOIN `project` AS Pr ON Pr.idProject=alt.numProject \r\n" + "\r\n" + where + "\r\n"
				+ " ORDER BY Arg.idArgument";

		sql += ";";
		return sql;

	}

	public boolean checkIfExistDoubleKey(String table, String values) {
		String[] tabValues = values.split(";");
		String query = "SELECT * FROM " + table + "WHERE ";
		for (int i = 0; i < tabValues.length; i++) {
			query += " = ";
		}
		return false;
	}

	private String buildLDQuery(int id) {
		String query = "SELECT numNewArgument, nameStakeholder, typeLikeDislike FROM likedislike AS ld"
				+ " JOIN stakeholder AS s ON ld.numStakeholder = s.idStakeholder" + " WHERE numArgument = " + id + ";";
		return query;
	}

	@Override
	public ArrayList<String[]> getLikeDislike(Argument argument, String projet) {
		String query = buildLDQuery(argument.getIdArgument());
		Connection cnx = null;
		ResultSet result = null;
		ArrayList<String[]> array = new ArrayList<String[]>();
		try {
			cnx = getConnection();
			result = execSelectQuery(cnx, query);
			array = fillLD(result);
		} catch (SQLException e) {
			log.error(ERROR_RETRIEVE_PRIMARY_KEY, e);
		} finally {
			try {
				closeResultSet(result);
				releaseConnection(cnx);
			} catch (SQLException e) {
				log.error(ERROR_RELEASE_RESSOURCES, e);
			}
		}
		return array;
	}

	private ArrayList<String[]> fillLD(ResultSet result) throws SQLException {
		ArrayList<String[]> array = new ArrayList<String[]>();
		while (result.next()) {
			String[] tab = new String[3];
			tab[0] = Integer.toString(result.getInt(1));
			tab[1] = result.getString(2);
			tab[2] = Boolean.toString(result.getBoolean(3));
			array.add(tab);
		}
		return array;
	}

}
