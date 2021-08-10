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
package fr.inra.MyChoice.controller;

public class TestMain {

	
	private static String buildQueryArgument(String projectName) {
		String where = "WHERE nameProject = '" + projectName + "' ";
		String sql = "SELECT idArgument, s.nameStakeholder,nameAlternative,typeProCon,nameProperty,\r\n"
				+ "Arg.date, A.description , assertion, explanation,qualValue, nameSource, \r\n"
				+ "nameCriterion,obtention,nameTypeSource \r\n"
				+ "FROM `argument` AS Arg\r\n" + "JOIN `aim` As A ON A.idAim = Arg.numAim \r\n"
				+ "JOIN `criterion` As c ON A.numCriterion = c.idCriterion \r\n"
				+ "JOIN `alternative` As alt ON alt.idAlternative =  Arg.numAlternative  \r\n"
				+ "JOIN `stakeholder` AS s ON s.idStakeholder = Arg.numStakeholder\r\n"
				+ "JOIN `qualvalue` AS l ON l.idQualValue = Arg.numQualValue\r\n"
				+ "JOIN `source` AS so ON so.idSource = Arg.numSource\r\n"
				+ "JOIN `property` AS p ON p.idProperty = Arg.numProperty \r\n"
				+ "JOIN `typesource` AS T ON T.idTypeSource=so.numTypeSource \r\n"
				+ "JOIN `project` AS Pr ON Pr.idProject=alt.numProject \r\n" + "\r\n"
				+  where + "\r\n"
				+ " ORDER BY Arg.idArgument";

		sql += ";";
		return sql;

	}
	
	public static void main(String[] args) {
		System.out.println(buildQueryArgument("VITAMIN"));

	}

}
