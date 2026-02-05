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
package fr.inra.MyChoice.util;

import java.io.IOException;
import java.io.InputStream;
import java.lang.invoke.MethodHandles;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * Database connection pool using HikariCP
 * 
 *
 */
public class HikariCPDataSource {

	private Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getName());
	private HikariDataSource pooledDataSource;
	public static String PROPERTY_FILE = "/mychoice.properties";
	public static String JDBC_URL = "jdbc.url";
	public static String DB_USER = "db.user";
	public static String DB_PASSWORD = "db.password";
	public static String ERROR_CONNECTION_POOL = "Unable to initialize connection pool";
	
	/**
	 * Singleton instance
	 */
	private static HikariCPDataSource instance;

	private HikariCPDataSource() {
		try {
			Properties properties = readPropertyFile(PROPERTY_FILE);
			HikariConfig config = new HikariConfig();
			config.setDriverClassName("org.mariadb.jdbc.Driver");
			config.setJdbcUrl(properties.getProperty(JDBC_URL));
			config.setUsername(properties.getProperty(DB_USER));
			config.setPassword(properties.getProperty(DB_PASSWORD));
			config.setMaximumPoolSize(20);
			config.setMinimumIdle(10);
			config.setConnectionTimeout(30000);
			config.setIdleTimeout(600000);
			config.setMaxLifetime(1800000);
			pooledDataSource = new HikariDataSource(config);
		} catch (Exception e) {
			log.error(ERROR_CONNECTION_POOL, e);
		}
	}

	static {
		instance = new HikariCPDataSource();
	}

	/**
	 * Get the connection pool
	 * @return An object corresponding to the datasource
	 */
	private HikariDataSource getPooledDataSource() {
		return pooledDataSource;
	}
	
	
	/**
	 * Create and fill a Properties object
	 * @param filename The file name of the property file
	 * @return an object filled with the properties. 
	 */
	private Properties readPropertyFile(String filename) {
		Properties prop = new Properties();
		InputStream stream;
		try {
			stream = this.getClass().getResourceAsStream(filename);
			if (stream != null) {
				prop.load(stream);
				stream.close();
			} else {
				log.error("Unable to find property file : " + filename);
			}
		} catch (IOException e) {
			log.error("Unable to load property file : " + filename, e);
		}
		return prop;
	}

	/**
	 * Return a database connection
	 * @return A database connection
	 * @throws SQLException if the database is not available
	 */
	public static Connection getConnection() throws SQLException {
		return instance.getPooledDataSource().getConnection();
	}
}
