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
package fr.inra.MyChoice.dao;

import java.lang.invoke.MethodHandles;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.inra.MyChoice.util.HikariCPDataSource;

public abstract class Dao {

	protected static final String ERROR_UNKNOWN_PROJECT = "Unknown project, please enter a valid project name.";
	protected static final String ERROR_SQL_QUERY = "Unable to execute sql query.";
	protected static final String ERROR_RETRIEVE_PROJECT = "Unable to retrieve project information.";
	protected static final String ERROR_RETRIEVE_ARGUMENTS = "Unable to retrieve arguments information.";
	protected static final String ERROR_RETRIEVE_PRIMARY_KEY = "Unable to retrieve primary key.";
	protected static final String ERROR_PROJECT_DOES_NOT_EXIST = "Project should already exist";
	protected static final String ERROR_RETRIEVE_COLUMN_NAME = "Unable to retrieve column name.";
	protected static final String ERROR_INSERT_ELEMENT = "Unable to insert element into the database.";
	protected static final String ERROR_RELEASE_RESSOURCES = "Unable to release resources.";
	protected static final String WARNING_RESULT_NULL = "Result was null.";
	protected static final String WARNING_CONNECTION_NULL = "Connection was null.";
	protected static final String WARNING_CONNECTION_CLOSED = "Connection was already closed.";
	protected static final String WARNING_RESULT_CLOSED = "Result was already closed.";
	protected static final String WARNING_DUPLICATE = "Current value already exist in database.";

	private Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getName());

	public Dao() {
	}

	/**
	 * Release a database connection
	 * 
	 * @param cnx The connection to release
	 * @throws SQLException if a database access error occurs
	 */
	protected void releaseConnection(Connection cnx) throws SQLException {
		if (cnx == null) {
		} else {
			if (cnx.isClosed()) {
				log.warn(WARNING_CONNECTION_NULL);
			} else {
				cnx.close();
				log.warn(WARNING_CONNECTION_CLOSED);

			}
		}
	}

	/**
	 * Retrieve a db connection.
	 * 
	 * @return A db connection
	 * @throws SQLException if a database access error occurs
	 */
	protected Connection getConnection() throws SQLException {
		return HikariCPDataSource.getConnection();

	}

	/**
	 * Close the ResultSet object set as input parameter
	 * 
	 * @throws SQLException if a database access error occurs
	 */
	protected void closeResultSet(ResultSet r) throws SQLException {
		if (r == null) {
			log.warn(WARNING_RESULT_NULL);
		} else {
			if (r.isClosed()) {
				log.warn(WARNING_RESULT_CLOSED);
			} else {
				r.close();

			}
		}
	}

}
