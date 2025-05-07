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
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {
  VApp,
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  VDivider,
  VBtn,
  VIcon,
  VCard,
  VCardTitle,
  VCardText,
  VDialog,
  VMain,
  VItemGroup,       // pour remplacer VListItemGroup
  VListSubheader,   // pour remplacer VSubheader
  VOverlay,
  VProgressCircular,
  VSnackbar,
  VFooter,
  VContainer,
  VListItemAction,
  VSpacer,
  VCardSubtitle,
  VRow,
  VCol,
  VToolbarTitle,
  VTooltip,
  VAppBarNavIcon,
  VForm,
  VCombobox,
  VImg,
  VAvatar,
  VChip,
  VBadge,
  VExpandTransition,
  VMenu,
  VBtnToggle,
  VToolbar,
  VAutocomplete,
  VTextField,
  VSelect
} from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components: {
    VApp,
    VAppBar,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VDivider,
    VBtn,
    VIcon,
    VCard,
    VCardTitle,
    VCardText,
    VDialog,
    VMain,
    VItemGroup,       // pour remplacer VListItemGroup
    VListSubheader,   // pour remplacer VSubheader
    VOverlay,
    VProgressCircular,
    VSnackbar,
    VFooter,
    VContainer,
    VListItemAction,
    VSpacer,
    VCardSubtitle,
    VRow,
    VCol,
    VToolbarTitle,
    VTooltip,
    VAppBarNavIcon,
    VForm,
    VCombobox,
    VImg,
    VAvatar,
    VChip,
    VBadge,
    VExpandTransition,
    VMenu,
    VBtnToggle,
    VToolbar,
    VAutocomplete,
    VTextField,
    VSelect
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

export default vuetify
// Vue.use(Vuetify);

// export default new Vuetify({
//   theme: {
//     themes: {
//       light: {
//         primary: "#4F4F4F",
//         secondary: "#00A3A6"
//         // secondary: "#b0bec5",
//         // accent: "#8c9eff",
//         // error: "#b71c1c"
//       }
//     }
//   }
// });
