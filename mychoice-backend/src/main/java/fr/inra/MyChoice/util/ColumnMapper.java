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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

public class ColumnMapper {

	HashMap<String, String> argument = new HashMap<>();
	HashMap<String, String> stakeholder = new HashMap<>();
	HashMap<String, String> aim = new HashMap<>();
	HashMap<String, String> alternative = new HashMap<>();
	HashMap<String, String> criterion = new HashMap<>();
	HashMap<String, String> project = new HashMap<>();
	HashMap<String, String> property = new HashMap<>();
	HashMap<String, String> source = new HashMap<>();
	HashMap<String, String> typesource = new HashMap<>();
	HashMap<String, String> qualvalue = new HashMap<>();
	HashMap<String, String> likedislike = new HashMap<>();
	HashMap<String, String> incompatiblevalues = new HashMap<>();

	ArrayList<String> argumentColToInsert = new ArrayList<>();
	
	HashMap<String,HashMap<String, String>> hash = new HashMap<>();

	public ColumnMapper() {
		
		// On définit la liste des colonnes a insérer pour la table argument
		/*argumentColToInsert.add("stakeholder.id_stakeholder");
		argumentColToInsert.add("argument.num_alternative");
		argumentColToInsert.add("argument.num_property");
		argumentColToInsert.add("argument.num_aim");*/

		// On définit le mapping entre le nom des colonnes dans le fichier CSV
		// et le nom des colonnes en base

		argument.put("stakeholder.nameStakeholder", "numStakeholder");
		argument.put("alternative.nameAlternative","numAlternative");
		argument.put("property.nameProperty","numProperty");
		argument.put("qualvalue.QualValue","numQualValue");
		argument.put("source.nameSource","numSource");
		argument.put("aim.description","numAim");
		argument.put("criterion.nameCriterion","numCriterion");
		argument.put("qualvalue.qualValue","numQualValue");
		argument.put("typesource.nameTypeSource","numTypeSource");
		argument.put("project.nameProject","numProject");
		

		hash.put("argument", argument);
		hash.put("stakeholder", stakeholder);
		hash.put("aim", aim);
		hash.put("alternative", alternative);
		hash.put("criterion", criterion);
		hash.put("project", project);
		hash.put("property", property);
		hash.put("source", source);
		hash.put("typesource", typesource);
		hash.put("qualvalue", qualvalue);
		hash.put("likedislike", likedislike);
		hash.put("incompatiblevalues", incompatiblevalues);
	}

	public HashMap<String, String> getArgumentMappingToCSV() {
		return argument;
	}

	public ArrayList<String> getArgumentColToInsert() {
		return argumentColToInsert;
	}
	
	
	public String contains(String col) {
		if(this.argument.get(col)== null || this.argument.get(col).isEmpty()) {
			return null;
		}
		return this.argument.get(col);

	}

	public  void main() {
		ColumnMapper sample = new ColumnMapper();
		String line = "val1; val2";
		
		Iterator<String> it = sample.getArgumentColToInsert().iterator();
		while (it.hasNext()) {
			String argumentColCSVName = it.next();
			String argumentDBColName = sample.getDBColName(argumentColCSVName);
			String argumentValue = sample.getValue(line.split(";"), argumentColCSVName);
		}
	}

	/**
	 * Convertit le nom de la colonne en sa position dans le fichier CSV
	 * @param colName
	 * @return
	 */
	private int colNameToIndex(String colName){
		return 0;
	}
	
	/**
	 * Retourne la valeur de la colonne colCSVName dans le fichier CSV
	 * @param tableau
	 * @param colCSVName
	 * @return
	 */
	private String getValue(String[] tableau, String colCSVName){
		return tableau[colNameToIndex(colCSVName)];
	}
	
	/**
	 * Retourne le nom de la colonne en base, si un mapping existe la valeur du mapping est retourné sinon
	 * le nom de la colonne est retourné.
	 * 
	 * @param colName
	 * @return
	 */
	private String getDBColName(String colName) {
		return argument.containsKey(colName) ? argument.get(colName) : colName;
	}

}
