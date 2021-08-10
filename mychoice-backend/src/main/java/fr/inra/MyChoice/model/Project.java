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

import java.util.ArrayList;
import java.util.List;

public class Project {

	private List<String> nameStakeholder;
	private List<String> aim;
	private List<String> nameCriterion;
	private String nameProject;
	private String description;
	private String image;
	private ArrayList<AlternativeDescription> alternatives;
	private ArrayList<HasExpertise> hasExpertise;
	private ArrayList<TypeSource> typeSource;
	
	
	public Project(String name, String projectDescription, String image, ArrayList<String> actor, ArrayList<String> aim, ArrayList<String> criterion,
			ArrayList<AlternativeDescription> description) {
		this.nameProject = name;
		this.nameStakeholder = actor;
		this.aim = aim;
		this.nameCriterion = criterion;
		this.alternatives = description;
		this.description = projectDescription;
		this.image = image;
		this.hasExpertise = new ArrayList<>();
		this.typeSource = new ArrayList<>();
	}

	public ArrayList<HasExpertise> getHasExpertise() {
		return hasExpertise;
	}

	public void setHasExpertise(ArrayList<HasExpertise> hasExpertise) {
		this.hasExpertise = hasExpertise;
	}

	public ArrayList<TypeSource> getTypeSource() {
		return typeSource;
	}

	public void setTypeSource(ArrayList<TypeSource> typeSource) {
		this.typeSource = typeSource;
	}

	public void addExpertise(HasExpertise expertise){
		this.hasExpertise.add(expertise);
	}
	
	public void addTypeSource(TypeSource typeSource){
		this.typeSource.add(typeSource);
	}
	
	public List<String> getNameStakeholder() {
		return nameStakeholder;
	}

	public void setNameStakeholder(List<String> nameStakeholder) {
		this.nameStakeholder = nameStakeholder;
	}

	public String getNameProject() {
		return nameProject;
	}

	public void setNameProject(String nameProject) {
		this.nameProject = nameProject;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getDescription() {
		return description;
	}

	public ArrayList<AlternativeDescription> getAlternatives() {
		return alternatives;
	}

	public void setAlternatives(ArrayList<AlternativeDescription> alternatives) {
		this.alternatives = alternatives;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the aim
	 */
	public List<String> getAim() {
		return aim;
	}

	/**
	 * @param aim
	 *            the aim to set
	 */
	public void setAim(List<String> aim) {
		this.aim = aim;
	}

	/**
	 * @return the criterion
	 */
	public List<String> getNameCriterion() {
		return nameCriterion;
	}

	/**
	 * @param nameCriterion
	 *            the criterion to set
	 */
	public void setNameCriterion(List<String> nameCriterion) {
		this.nameCriterion = nameCriterion;
	}

}
