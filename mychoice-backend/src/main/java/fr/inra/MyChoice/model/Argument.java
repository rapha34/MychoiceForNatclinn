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
package fr.inra.MyChoice.model;

public class Argument {
	private int idArgument;
	private String assertion;
	private String explanation;
	private String date;
	public String getIsProspective() {
		return isProspective;
	}

	public void setIsProspective(String isProspective) {
		this.isProspective = isProspective;
	}

	private String nameStakeHolder;
	private String nameProperty;
	private String value;
	private boolean typeProCon;
	private String nameAlternative;
	private String nameCriterion;
	private String nameSource;
	private String aim;
	private String nameTypeSource;
	private String isProspective;
	private String condition;
	
	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public Argument() {
		super();
	}

	public Argument(int idArgument, String assertion, String explanation, boolean typeProCon, String nameProperty, String value,
			String nameSource, String date, String aim, String nameCriterion, String nameAlternative, String nameStakeHolder, String nameTypeSource, String isProspective) {
		
		this.idArgument = idArgument;
		this.assertion = assertion;
		this.explanation = explanation;
		this.date = date;
		this.nameStakeHolder = nameStakeHolder;
		this.nameProperty = nameProperty;
		this.value = value;
		this.typeProCon = typeProCon;
		this.nameAlternative = nameAlternative;
		this.nameCriterion = nameCriterion;
		this.nameSource = nameSource;
		this.aim = aim;
		this.nameTypeSource= nameTypeSource;
		this.isProspective = isProspective;
	}

	public Object get(String val) {

		switch (val) {

		case "id":
			return this.getIdArgument();

		case "assertion":
			return this.getAssertion();

		case "explication":
			return this.getExplanation();

		case "date":
			return this.getDate();

		case "auteur":
			return this.getNameStakeHolder();

		case "property":
			return this.getNameProperty();

		case "value":
			return this.getValue();

		case "favorable":
			return this.isTypeProCon();

		case "criterion":
			return this.getNameCriterion();

		case "alternative":
			return this.getNameAlternative();

		case "source":
			return this.getNameSource();

		case "aim":
			return this.getAim();

		}
		return null;
	}

	public int getIdArgument() {
		return idArgument;
	}

	public void setIdArgument(int idArgument) {
		this.idArgument = idArgument;
	}

	public String getAssertion() {
		return assertion;
	}

	public void setAssertion(String assertion) {
		this.assertion = assertion;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getNameStakeHolder() {
		return nameStakeHolder;
	}

	public void setNameStakeHolder(String nameStakeHolder) {
		this.nameStakeHolder = nameStakeHolder;
	}

	public String getNameProperty() {
		return nameProperty;
	}

	public void setNameProperty(String nameProperty) {
		this.nameProperty = nameProperty;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public boolean isTypeProCon() {
		return typeProCon;
	}

	public void setTypeProCon(boolean typeProCon) {
		this.typeProCon = typeProCon;
	}

	public String getNameAlternative() {
		return nameAlternative;
	}

	public void setNameAlternative(String nameAlternative) {
		this.nameAlternative = nameAlternative;
	}

	public String getNameCriterion() {
		return nameCriterion;
	}

	public void setNameCriterion(String nameCriterion) {
		this.nameCriterion = nameCriterion;
	}

	public String getNameSource() {
		return nameSource;
	}

	public void setNameSource(String nameSource) {
		this.nameSource = nameSource;
	}

	public String getAim() {
		return aim;
	}

	public void setAim(String aim) {
		this.aim = aim;
	}

	public String getNameTypeSource() {
		return nameTypeSource;
	}

	public void setNameTypeSource(String nameTypeSource) {
		this.nameTypeSource = nameTypeSource;
	}

}
