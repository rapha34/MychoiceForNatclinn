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
import { ServerProject } from "@/@types";
import { mockArguments, parseMockSource } from "./mock";
import projectSource from "../../public/project.json";

const mockData = mockArguments([
  {
    nameProperty: "property A",
    value: "value 1",
    aim: "aim 1",
    nameCriterion: "criterion 1"
  },
  {
    nameProperty: "property A",
    value: "value 1",
    aim: "aim 1",
    nameCriterion: "criterion 1"
  },
  {
    nameProperty: "property B",
    value: "value 1",
    aim: "aim 2",
    nameCriterion: "criterion 1"
  },
  {
    nameProperty: "property A",
    value: "value 3",
    aim: "aim 3",
    nameCriterion: "criterion 2"
  },
  {
    nameProperty: "property C",
    value: "value 4",
    aim: "aim 4",
    nameCriterion: "criterion 3"
  },
  {
    nameProperty: "property D",
    value: "value 4",
    aim: "aim 4",
    nameCriterion: "criterion 3"
  }
]);

const data = parseMockSource(mockData, projectSource);

it("should returns the right criterion count", async () => {
  expect(Object.keys(data.criterions).length).toEqual(3);
});

it("should returns the right aim count", async () => {
  expect(Object.keys(data.aims).length).toEqual(4);
});

it("should returns the right properties count", async () => {
  expect(Object.keys(data.properties).length).toEqual(4);
});

it("should returns the right labels count", async () => {
  expect(Object.keys(data.labels).length).toEqual(5);
});
