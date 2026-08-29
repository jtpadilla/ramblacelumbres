/**
 * Catalogo de flores silvestres de la rambla.
 *
 * Viene de las diez entradas «Flores a-b», «Flores c-d»... del blog original,
 * donde cada foto llevaba en el pie el nombre cientifico, el comun y la familia.
 * Los nombres cientificos se han corregido; cuando el original no permitia
 * identificar la especie con seguridad se deja solo el genero.
 */
export interface Flor {
  /** ruta dentro de src/assets/uploads */
  foto: string;
  /** nombre cientifico (se muestra en cursiva) */
  cientifico: string;
  /** familia botanica, en latin */
  familia: string;
  /** nombres comunes por idioma; vacio si no hay uno fiable */
  nombre: { es: string; ca: string; en: string };
}

export const FLORES: Flor[] = [
  { foto: '2014/10/Adonis-annua.jpg', cientifico: 'Adonis annua', familia: 'Ranunculaceae', nombre: { es: 'gota de sangre, ojo de perdiz', ca: 'ull de perdiu' , en: "pheasant's-eye" } },
  { foto: '2014/10/Allium-oleracerum.jpg', cientifico: 'Allium oleraceum', familia: 'Amaryllidaceae', nombre: { es: 'ajo silvestre', ca: 'all silvestre' , en: "field garlic" } },
  { foto: '2014/10/Allium-scorodoprasum.jpg', cientifico: 'Allium scorodoprasum', familia: 'Amaryllidaceae', nombre: { es: 'ajo pardo', ca: '' , en: "sand leek" } },
  { foto: '2014/10/anchusa-azurea.jpg', cientifico: 'Anchusa azurea', familia: 'Boraginaceae', nombre: { es: 'chupamieles, lengua de buey', ca: 'llengua de bou' , en: "Italian bugloss" } },
  { foto: '2014/10/Androsace-obtusifolia1.jpg', cientifico: 'Androsace obtusifolia', familia: 'Primulaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/10/Anthericum-lilago.jpg', cientifico: 'Anthericum liliago', familia: 'Asparagaceae', nombre: { es: 'hierba de la araña, falangera', ca: '' , en: "St Bernard's lily" } },
  { foto: '2014/10/Aquilegia-vulgaris.jpg', cientifico: 'Aquilegia vulgaris', familia: 'Ranunculaceae', nombre: { es: 'aguileña común', ca: 'corniol' , en: "common columbine" } },
  { foto: '2014/10/Aristolochia-pistolochia.jpg', cientifico: 'Aristolochia pistolochia', familia: 'Aristolochiaceae', nombre: { es: 'aristoloquia menor', ca: 'aristolòquia' , en: "" } },
  { foto: '2014/10/Asphodelus-albus-vara-de-san-Jose-2.jpg', cientifico: 'Asphodelus albus', familia: 'Asphodelaceae', nombre: { es: 'gamón, vara de San José', ca: 'albó, porrassa' , en: "white asphodel" } },
  { foto: '2014/11/Carlina-hispanica.jpg', cientifico: 'Carlina hispanica', familia: 'Asteraceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/11/Catananche-caerulea-2.jpg', cientifico: 'Catananche caerulea', familia: 'Asteraceae', nombre: { es: 'hierba cupido', ca: '' , en: "cupid's dart" } },
  { foto: '2014/11/Centaurium-erytrhaea.jpg', cientifico: 'Centaurium erythraea', familia: 'Gentianaceae', nombre: { es: 'centaura menor', ca: 'centaura menor' , en: "common centaury" } },
  { foto: '2014/11/Cephalanthera-rubra.jpg', cientifico: 'Cephalanthera rubra', familia: 'Orchidaceae', nombre: { es: 'cefalantera roja', ca: '' , en: "red helleborine" } },
  { foto: '2014/11/Cichorium-intybus-achicoria.jpg', cientifico: 'Cichorium intybus', familia: 'Asteraceae', nombre: { es: 'achicoria', ca: 'xicoira' , en: "chicory" } },
  { foto: '2014/11/Daucus-carota-2.jpg', cientifico: 'Daucus carota', familia: 'Apiaceae', nombre: { es: 'zanahoria silvestre', ca: 'pastanaga borda' , en: "wild carrot" } },
  { foto: '2014/11/Delphinium-gracile.jpg', cientifico: 'Delphinium gracile', familia: 'Ranunculaceae', nombre: { es: 'espuela de caballero', ca: 'esperó de cavaller' , en: "larkspur" } },
  { foto: '2014/11/Dianthus-brotery-clavel-silvestre.jpg', cientifico: 'Dianthus broteri', familia: 'Caryophyllaceae', nombre: { es: 'clavel silvestre', ca: 'clavell silvestre' , en: "wild carnation" } },
  { foto: '2014/11/Echium-plantagineum-vivorer.jpg', cientifico: 'Echium plantagineum', familia: 'Boraginaceae', nombre: { es: 'viborera', ca: 'viperina' , en: "purple viper's-bugloss" } },
  { foto: '2014/11/Erinacea-antyllis.jpg', cientifico: 'Erinacea anthyllis', familia: 'Fabaceae', nombre: { es: 'piorno azul, cojín de monja', ca: 'coixí de monja' , en: "hedgehog broom" } },
  { foto: '2014/11/Erodium-melacoides.jpg', cientifico: 'Erodium malacoides', familia: 'Geraniaceae', nombre: { es: 'alfilerillo', ca: '' , en: "Mediterranean stork's-bill" } },
  { foto: '2014/11/Euphorbia-1.jpg', cientifico: 'Euphorbia', familia: 'Euphorbiaceae', nombre: { es: 'lechetrezna', ca: 'lleteresa' , en: "spurge" } },
  { foto: '2014/11/Fritillaria-hispanica.jpg', cientifico: 'Fritillaria hispanica', familia: 'Liliaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/11/Gladiolus-illyricus.jpg', cientifico: 'Gladiolus illyricus', familia: 'Iridaceae', nombre: { es: 'gladiolo silvestre', ca: 'gladiol silvestre' , en: "wild gladiolus" } },
  { foto: '2014/11/Globularia-vulgaris-1.jpg', cientifico: 'Globularia vulgaris', familia: 'Plantaginaceae', nombre: { es: 'globularia', ca: 'globulària' , en: "common globularia" } },
  { foto: '2014/11/Helianthemun-apenninum-1.jpg', cientifico: 'Helianthemum apenninum', familia: 'Cistaceae', nombre: { es: '', ca: '' , en: "white rock-rose" } },
  { foto: '2014/11/Helianthemun-nummularium-2.jpg', cientifico: 'Helianthemum nummularium', familia: 'Cistaceae', nombre: { es: 'heliantemo', ca: 'heliantem' , en: "common rock-rose" } },
  { foto: '2014/11/Hepatica-nobilis-1.jpg', cientifico: 'Hepatica nobilis', familia: 'Ranunculaceae', nombre: { es: 'hepática', ca: 'herba fetgera' , en: "liverleaf" } },
  { foto: '2014/11/Ipomoea-carnea.jpg', cientifico: 'Ipomoea carnea', familia: 'Convolvulaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/11/Koeleria-vallesiana.jpg', cientifico: 'Koeleria vallesiana', familia: 'Poaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/11/Leuzea-conifera.jpg', cientifico: 'Leuzea conifera', familia: 'Asteraceae', nombre: { es: 'cuchara de pastor', ca: '' , en: "cone knapweed" } },
  { foto: '2014/11/Linaria-arabiniana-2.jpg', cientifico: 'Linaria', familia: 'Plantaginaceae', nombre: { es: 'linaria', ca: 'linària' , en: "toadflax" } },
  { foto: '2014/11/Linaria-arabiniana.jpg', cientifico: 'Linaria', familia: 'Plantaginaceae', nombre: { es: 'linaria', ca: 'linària' , en: "toadflax" } },
  { foto: '2014/11/Linum-suffruticosum.jpg', cientifico: 'Linum suffruticosum', familia: 'Linaceae', nombre: { es: 'lino blanco', ca: 'lli blanc' , en: "white flax" } },
  { foto: '2014/11/Linum-usitatissimun.jpg', cientifico: 'Linum usitatissimum', familia: 'Linaceae', nombre: { es: 'lino', ca: 'lli' , en: "flax" } },
  { foto: '2014/11/madre-selva.jpg', cientifico: 'Lonicera', familia: 'Caprifoliaceae', nombre: { es: 'madreselva', ca: 'lligabosc' , en: "honeysuckle" } },
  { foto: '2014/11/Margarita-Bellis.jpg', cientifico: 'Bellis perennis', familia: 'Asteraceae', nombre: { es: 'margarita', ca: 'margarida' , en: "daisy" } },
  { foto: '2014/11/Merendera-bulbocodium.jpg', cientifico: 'Merendera bulbocodium', familia: 'Colchicaceae', nombre: { es: 'quitameriendas', ca: '' , en: "" } },
  { foto: '2014/11/Muscaris-nazarenos.jpg', cientifico: 'Muscari neglectum', familia: 'Asparagaceae', nombre: { es: 'nazareno', ca: 'calabruixa' , en: "grape hyacinth" } },
  { foto: '2014/11/Nigella-damascena-arañuela.jpg', cientifico: 'Nigella damascena', familia: 'Ranunculaceae', nombre: { es: 'arañuela', ca: '' , en: "love-in-a-mist" } },
  { foto: '2014/11/Onobrychis-stenorhiza.jpg', cientifico: 'Onobrychis stenorhiza', familia: 'Fabaceae', nombre: { es: 'esparceta', ca: 'trepadella' , en: "sainfoin" } },
  { foto: '2014/11/Ononis-natrix.jpg', cientifico: 'Ononis natrix', familia: 'Fabaceae', nombre: { es: '', ca: '' , en: "yellow restharrow" } },
  { foto: '2014/12/Papaver-rhoeas-amapolas.jpg', cientifico: 'Papaver rhoeas', familia: 'Papaveraceae', nombre: { es: 'amapola', ca: 'rosella' , en: "common poppy" } },
  { foto: '2014/12/Papaver-Rupifragum-amapola.jpg', cientifico: 'Papaver rupifragum', familia: 'Papaveraceae', nombre: { es: 'amapola', ca: 'rosella' , en: "Spanish poppy" } },
  { foto: '2014/12/Petrorhagia-prolifera-clave.jpg', cientifico: 'Petrorhagia prolifera', familia: 'Caryophyllaceae', nombre: { es: '', ca: '' , en: "proliferous pink" } },
  { foto: '2014/12/Phlomis-purpurea.jpg', cientifico: 'Phlomis purpurea', familia: 'Lamiaceae', nombre: { es: 'matagallo', ca: '' , en: "purple phlomis" } },
  { foto: '2014/12/Phlomis.jpg', cientifico: 'Phlomis lychnitis', familia: 'Lamiaceae', nombre: { es: 'candilera, oreja de burro', ca: 'candelera' , en: "lampwick plant" } },
  { foto: '2014/12/Plantago-lagopus.jpg', cientifico: 'Plantago lagopus', familia: 'Plantaginaceae', nombre: { es: 'llantén', ca: 'plantatge' , en: "hare's-foot plantain" } },
  { foto: '2014/12/Potentilla-neumanniana.jpg', cientifico: 'Potentilla neumanniana', familia: 'Rosaceae', nombre: { es: 'cincoenrama', ca: '' , en: "spring cinquefoil" } },
  { foto: '2014/12/Almendro.jpg', cientifico: 'Prunus dulcis', familia: 'Rosaceae', nombre: { es: 'almendro', ca: 'ametler' , en: "almond" } },
  { foto: '2014/12/Ranunculus-repens.jpg', cientifico: 'Ranunculus repens', familia: 'Ranunculaceae', nombre: { es: 'botón de oro', ca: "botó d'or" , en: "creeping buttercup" } },
  { foto: '2014/12/rosa-canina-2.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose" } },
  { foto: '2014/12/rosa-canina.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose" } },
  { foto: '2014/12/rosa-canina-1.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose" } },
  { foto: '2014/12/Salvia-pratensis.jpg', cientifico: 'Salvia pratensis', familia: 'Lamiaceae', nombre: { es: 'salvia de prado', ca: 'sàlvia de prat' , en: "meadow clary" } },
  { foto: '2014/12/Scabiosa-atropurpurea.jpg', cientifico: 'Scabiosa atropurpurea', familia: 'Dipsacaceae', nombre: { es: 'escabiosa', ca: 'escabiosa' , en: "sweet scabious" } },
  { foto: '2014/12/Scabiosa-atropurpurea-2.jpg', cientifico: 'Scabiosa atropurpurea', familia: 'Dipsacaceae', nombre: { es: 'escabiosa', ca: 'escabiosa' , en: "sweet scabious" } },
  { foto: '2014/12/Scabiosa-menor.jpg', cientifico: 'Scabiosa', familia: 'Dipsacaceae', nombre: { es: 'escabiosa menor', ca: 'escabiosa menuda' , en: "scabious" } },
  { foto: '2014/12/Sedun-acre.jpg', cientifico: 'Sedum acre', familia: 'Crassulaceae', nombre: { es: 'pampajarito', ca: 'crespinell' , en: "biting stonecrop" } },
  { foto: '2014/12/Sedun-sediforme.jpg', cientifico: 'Sedum sediforme', familia: 'Crassulaceae', nombre: { es: 'uña de gato', ca: 'crespinell gros' , en: "pale stonecrop" } },
  { foto: '2014/12/Sideretis-hirsuta.jpg', cientifico: 'Sideritis hirsuta', familia: 'Lamiaceae', nombre: { es: 'rabo de gato', ca: 'rabet de gat' , en: "ironwort" } },
  { foto: '2014/12/Silene-andryalifolia.jpg', cientifico: 'Silene andryalifolia', familia: 'Caryophyllaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/12/Silene-vulgaris.jpg', cientifico: 'Silene vulgaris', familia: 'Caryophyllaceae', nombre: { es: 'colleja', ca: 'colitx' , en: "bladder campion" } },
  { foto: '2014/12/Thalictrum-tuberosum-1.jpg', cientifico: 'Thalictrum tuberosum', familia: 'Ranunculaceae', nombre: { es: '', ca: '' , en: "" } },
  { foto: '2014/12/Tragopogon-crocifolius.jpg', cientifico: 'Tragopogon crocifolius', familia: 'Asteraceae', nombre: { es: 'barba cabruna', ca: '' , en: "goat's-beard" } },
  { foto: '2014/12/Tragopogon-trapensis.jpg', cientifico: 'Tragopogon', familia: 'Asteraceae', nombre: { es: 'barba cabruna', ca: '' , en: "goat's-beard" } },
  { foto: '2014/12/Ulex-parviflorus-aliaga.jpg', cientifico: 'Ulex parviflorus', familia: 'Fabaceae', nombre: { es: 'aliaga', ca: 'argelaga' , en: "Mediterranean gorse" } },
  { foto: '2014/12/Urospermun-dalechampii.jpg', cientifico: 'Urospermum dalechampii', familia: 'Asteraceae', nombre: { es: '', ca: 'amargot' , en: "" } },
  { foto: '2014/12/Verbascum-pulverulentum.jpg', cientifico: 'Verbascum pulverulentum', familia: 'Scrophulariaceae', nombre: { es: 'gordolobo', ca: 'blenera' , en: "hoary mullein" } },
  { foto: '2014/12/Viola-sylvestris-violeta.jpg', cientifico: 'Viola sylvestris', familia: 'Violaceae', nombre: { es: 'violeta', ca: 'violeta de bosc' , en: "wood violet" } },
];
