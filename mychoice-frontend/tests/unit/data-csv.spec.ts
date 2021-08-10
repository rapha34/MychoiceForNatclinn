/*
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
See more on https://ico.iate.inra.fr/MyChoice
This application is registered to the European organization for the
protection of authors and publishers of digital creations with
the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900 

This software is governed by the CeCILL-C license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL-C
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 
As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 
In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 
The fact that you are presently reading this means that you have had
knowledge of the CeCILL-C license and that you accept its terms.
*/
import { getCSVFromJSON } from "@/data-csv";

import vitamin from "./vitamin.json";
// const expectedProjectCSV = `project;;;;;;;;;;;;;;;;;;;
// nameProject;description;image;;;;;;;;;;;;;;;;;
// VITAMIN;VegetarIan Transition Argument ModellINg: le projet VITAMIN s�int�resse � l�actuelle tendance vers une d�croissance de la consommation de viande et vers des r�gimes � base v�g�tale dans les pays d�velopp�s. Il a pour objectif de comprendre la possible �mergence d�une seconde transition alimentaire. Le projet est centr� sur une approche de mod�lisation. Il �tudie les d�cisions alimentaires � long terme et s�appuie sur la construction d�un mod�le combinant syst�mes d�argumentation et simulation multi-agent pour mod�liser les d�cisions des individus d�une population en fonction de diff�rents facteurs (valeurs individuelles, influence du r�seau social, de crises, de communications, etc.).;photoVITAMIN.jpg;;;;;;;;;;;;;;;;;`;

const expectedProjectCSV = `nameProject;description;image;;;;;;;;;;;;;;;;;
VITAMIN;VegetarIan Transition Argument ModellINg: le projet VITAMIN s�int�resse � l�actuelle tendance vers une d�croissance de la consommation de viande et vers des r�gimes � base v�g�tale dans les pays d�velopp�s. Il a pour objectif de comprendre la possible �mergence d�une seconde transition alimentaire. Le projet est centr� sur une approche de mod�lisation. Il �tudie les d�cisions alimentaires � long terme et s�appuie sur la construction d�un mod�le combinant syst�mes d�argumentation et simulation multi-agent pour mod�liser les d�cisions des individus d�une population en fonction de diff�rents facteurs (valeurs individuelles, influence du r�seau social, de crises, de communications, etc.).;photoVITAMIN.jpg;;;;;;;;;;;;;;;;;`;

it("should return csv project", async () => {
  //   const VITAMIN_SPREADSHEET_ID = "1J69CAgoAV9naltxJZs89dOI1NoGX8Ex6iw_PtgqKxic";
  const worksheets = vitamin;
  const argumentWorksheet = worksheets.find(
    worksheet => worksheet.title === "argument"
  ).data;
  const projectWorksheet = worksheets.find(
    worksheet => worksheet.title === "project"
  ).data;

  //@ts-ignore
  const projectCSV = getCSVFromJSON(fillEmpty);

  expect(projectCSV).toEqual(expectedProjectCSV);
});
