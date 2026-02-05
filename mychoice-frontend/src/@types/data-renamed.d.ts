/*
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
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
import { expertiseEntity, SourceTypeEntity } from "./data-server";

export interface Project {
  stakeholders?: Array<string> | null;
  aims?: Array<string> | null;
  criterions?: Array<string> | null;
  name: string;
  description: string;
  image: string;
  alternatives: Alternative[];
  expertiseEntities: expertiseEntity[];
  sourceTypeEntities: SourceTypeEntity[];
  products?: Product[];
  compositions?: Composition[];
}

export interface Alternative {
  name: string;
  description: string;
  image: string;
  icon: string;
}

export type Alternatives = Array<Alternative>;

export interface Argument {
  id: number;
  assertion: string;
  explanation: string;
  date: string;
  stakeholder: string;
  property: string;
  value: string;
  favorable: boolean;
  alternative: string;
  criterion: string;
  source: string;
  aim: string;
  isProspective: string;
  sourceType: string;
  condition?: string;
  tagInitiator?: string;
}

export interface Product {
  nameAlternative: string;
  productUri: string;
  nameProduct: string;
  tagProduct: string[]; // Liste de tags séparés par des virgules
}

export interface Composition {
  uriCompose: string;
  nameCompose: string;
  typeComposant: 'Product' | 'Ingredient';
  uriComposant: string;
  nameComposant: string;
  rang: number;
  tagComposant: string[]; // Liste de tags séparés par des virgules
}

export interface Entities {
  criterions: "criterion";
}

export type Arguments = Array<Argument>;

export type Data = {
  items: Argument[];
  project: Project;
};
