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

import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import fr.inra.MyChoice.business.ArgumentBusiness;
import fr.inra.MyChoice.model.Argument;

/**
 * Controller used to handle arguments
 * 
 */
@RestController
@RequestMapping("/api")
public class ArgumentController {

	ArgumentBusiness business;

	private static final String DEFAULT_PROJECT_NAME = "mock";
	private static final String DEFAULT_MODE = "CONSENSUS";
	private static final String MOCK_FILE_NAME = "/argument.json";
	private HashMap<String, List<Argument>> argsByProject;
	private Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass().getName());

	public ArgumentController() throws JsonParseException, JsonMappingException, IOException {
		business = new ArgumentBusiness();
		List<Argument> args;
		argsByProject = new HashMap<String, List<Argument>>();
		argsByProject.put(DEFAULT_PROJECT_NAME, new ArrayList<Argument>());
	}

	/**
	 * Return a list of arguments for a given project
	 * 
	 * @param project The project name / identifier
	 * @return a list of arguments
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	@CrossOrigin
	@RequestMapping("/arguments")
	public Object arguments(@RequestParam(value = "project", defaultValue = DEFAULT_PROJECT_NAME) String projectName,
			@RequestParam(value = "mode", defaultValue = DEFAULT_MODE) String mode) {
		List<Argument> args;
		log.info("Request arguments for project : {}", projectName);
		log.info("Mode : {}", mode);
		try {
			args = business.getArguments(projectName);
			return args;
		} catch (Exception e) {
			log.error("Unexpected error", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}

	}
}
