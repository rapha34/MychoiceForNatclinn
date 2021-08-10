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
import { mockArguments, parseMockSource } from "./mock";
import { filterItemsBy } from "@/store/items";
import { getWeightedAcceptability } from "@/store/acceptability";
import { NormalizedData, ServerProject } from "@/@types";

import { state } from "@/store";
const mockData = mockArguments([
  {
    idArgument: 1,
    nameAlternative: "Alternative 1",
    typeProCon: true,
    aim: "But 1",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 2,
    nameAlternative: "Alternative 1",
    typeProCon: true,
    aim: "But 1",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 3,
    nameAlternative: "Alternative 1",
    typeProCon: false,
    aim: "But 1",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 4,
    nameAlternative: "Alternative 1",
    typeProCon: false,
    aim: "But 3",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 5,
    nameAlternative: "Alternative 1",
    typeProCon: true,
    aim: "But 4",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 6,
    nameAlternative: "Alternative 2",
    typeProCon: true,
    aim: "But 2",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 7,
    nameAlternative: "Alternative 2",
    typeProCon: true,
    aim: "But 3",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 8,
    nameAlternative: "Alternative 2",
    typeProCon: false,
    aim: "But 3",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 9,
    nameAlternative: "Alternative 2",
    typeProCon: false,
    aim: "But 3",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 10,
    nameAlternative: "Alternative 2",
    typeProCon: false,
    aim: "But 3",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 11,
    nameAlternative: "Alternative 2",
    typeProCon: true,
    aim: "But 4",
    nameCriterion: "Criterion 1"
  },
  {
    idArgument: 12,
    nameAlternative: "Alternative 2",
    typeProCon: false,
    aim: "But 4",
    nameCriterion: "Criterion 1"
  }
]);

const mockProject: Partial<ServerProject> = {
  alternatives: [
    {
      nameAlternative: "Alternative 1",
      description: "",
      imageAlternative: "",
      iconAlternative: ""
    },
    {
      nameAlternative: "Alternative 2",
      description: "",
      imageAlternative: "",
      iconAlternative: ""
    }
  ]
};

//@ts-ignore
state.data = parseMockSource(mockData, mockProject);

it("should returns the right Acceptability count", async () => {
  //@ts-ignore
  const total = getWeightedAcceptability(state.data.items);

  // V1 ALGORITHM
  // expect(total[1]).toEqual(0.46);
  // expect(total[2]).toEqual(0.44);

  // V2 ALGORITHM
  expect(total[1]).toEqual(0.5);
  expect(total[2]).toEqual(0.44);

  // V2 ALGORITHM not rounded
  const totalNotRounded = getWeightedAcceptability(state.data.items, false);

  expect(totalNotRounded[1]).toEqual(0.49722222222222223);
  expect(totalNotRounded[2]).toEqual(0.4444444444444444);
});
