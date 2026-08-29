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
  nombre: { es: string; ca: string; en: string; zh: string };
}

export const FLORES: Flor[] = [
  { foto: '2014/10/Adonis-annua.jpg', cientifico: 'Adonis annua', familia: 'Ranunculaceae', nombre: { es: 'gota de sangre, ojo de perdiz', ca: 'ull de perdiu' , en: "pheasant's-eye", zh: '' } },
  { foto: '2014/10/Allium-oleracerum.jpg', cientifico: 'Allium oleraceum', familia: 'Amaryllidaceae', nombre: { es: 'ajo silvestre', ca: 'all silvestre' , en: "field garlic", zh: '' } },
  { foto: '2014/10/Allium-scorodoprasum.jpg', cientifico: 'Allium scorodoprasum', familia: 'Amaryllidaceae', nombre: { es: 'ajo pardo', ca: '' , en: "sand leek", zh: '' } },
  { foto: '2014/10/anchusa-azurea.jpg', cientifico: 'Anchusa azurea', familia: 'Boraginaceae', nombre: { es: 'chupamieles, lengua de buey', ca: 'llengua de bou' , en: "Italian bugloss", zh: '意大利牛舌草' } },
  { foto: '2014/10/Androsace-obtusifolia1.jpg', cientifico: 'Androsace obtusifolia', familia: 'Primulaceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/10/Anthericum-lilago.jpg', cientifico: 'Anthericum liliago', familia: 'Asparagaceae', nombre: { es: 'hierba de la araña, falangera', ca: '' , en: "St Bernard's lily", zh: '' } },
  { foto: '2014/10/Aquilegia-vulgaris.jpg', cientifico: 'Aquilegia vulgaris', familia: 'Ranunculaceae', nombre: { es: 'aguileña común', ca: 'corniol' , en: "common columbine", zh: '欧耧斗菜' } },
  { foto: '2014/10/Aristolochia-pistolochia.jpg', cientifico: 'Aristolochia pistolochia', familia: 'Aristolochiaceae', nombre: { es: 'aristoloquia menor', ca: 'aristolòquia' , en: "", zh: '' } },
  { foto: '2014/10/Asphodelus-albus-vara-de-san-Jose-2.jpg', cientifico: 'Asphodelus albus', familia: 'Asphodelaceae', nombre: { es: 'gamón, vara de San José', ca: 'albó, porrassa' , en: "white asphodel", zh: '白阿福花' } },
  { foto: '2014/11/Carlina-hispanica.jpg', cientifico: 'Carlina hispanica', familia: 'Asteraceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/11/Catananche-caerulea-2.jpg', cientifico: 'Catananche caerulea', familia: 'Asteraceae', nombre: { es: 'hierba cupido', ca: '' , en: "cupid's dart", zh: '蓝箭菊' } },
  { foto: '2014/11/Centaurium-erytrhaea.jpg', cientifico: 'Centaurium erythraea', familia: 'Gentianaceae', nombre: { es: 'centaura menor', ca: 'centaura menor' , en: "common centaury", zh: '' } },
  { foto: '2014/11/Cephalanthera-rubra.jpg', cientifico: 'Cephalanthera rubra', familia: 'Orchidaceae', nombre: { es: 'cefalantera roja', ca: '' , en: "red helleborine", zh: '红花头蕊兰' } },
  { foto: '2014/11/Cichorium-intybus-achicoria.jpg', cientifico: 'Cichorium intybus', familia: 'Asteraceae', nombre: { es: 'achicoria', ca: 'xicoira' , en: "chicory", zh: '菊苣' } },
  { foto: '2014/11/Daucus-carota-2.jpg', cientifico: 'Daucus carota', familia: 'Apiaceae', nombre: { es: 'zanahoria silvestre', ca: 'pastanaga borda' , en: "wild carrot", zh: '野胡萝卜' } },
  { foto: '2014/11/Delphinium-gracile.jpg', cientifico: 'Delphinium gracile', familia: 'Ranunculaceae', nombre: { es: 'espuela de caballero', ca: 'esperó de cavaller' , en: "larkspur", zh: '' } },
  { foto: '2014/11/Dianthus-brotery-clavel-silvestre.jpg', cientifico: 'Dianthus broteri', familia: 'Caryophyllaceae', nombre: { es: 'clavel silvestre', ca: 'clavell silvestre' , en: "wild carnation", zh: '' } },
  { foto: '2014/11/Echium-plantagineum-vivorer.jpg', cientifico: 'Echium plantagineum', familia: 'Boraginaceae', nombre: { es: 'viborera', ca: 'viperina' , en: "purple viper's-bugloss", zh: '车前叶蓝蓟' } },
  { foto: '2014/11/Erinacea-antyllis.jpg', cientifico: 'Erinacea anthyllis', familia: 'Fabaceae', nombre: { es: 'piorno azul, cojín de monja', ca: 'coixí de monja' , en: "hedgehog broom", zh: '' } },
  { foto: '2014/11/Erodium-melacoides.jpg', cientifico: 'Erodium malacoides', familia: 'Geraniaceae', nombre: { es: 'alfilerillo', ca: '' , en: "Mediterranean stork's-bill", zh: '' } },
  { foto: '2014/11/Euphorbia-1.jpg', cientifico: 'Euphorbia', familia: 'Euphorbiaceae', nombre: { es: 'lechetrezna', ca: 'lleteresa' , en: "spurge", zh: '大戟属' } },
  { foto: '2014/11/Fritillaria-hispanica.jpg', cientifico: 'Fritillaria hispanica', familia: 'Liliaceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/11/Gladiolus-illyricus.jpg', cientifico: 'Gladiolus illyricus', familia: 'Iridaceae', nombre: { es: 'gladiolo silvestre', ca: 'gladiol silvestre' , en: "wild gladiolus", zh: '' } },
  { foto: '2014/11/Globularia-vulgaris-1.jpg', cientifico: 'Globularia vulgaris', familia: 'Plantaginaceae', nombre: { es: 'globularia', ca: 'globulària' , en: "common globularia", zh: '' } },
  { foto: '2014/11/Helianthemun-apenninum-1.jpg', cientifico: 'Helianthemum apenninum', familia: 'Cistaceae', nombre: { es: '', ca: '' , en: "white rock-rose", zh: '' } },
  { foto: '2014/11/Helianthemun-nummularium-2.jpg', cientifico: 'Helianthemum nummularium', familia: 'Cistaceae', nombre: { es: 'heliantemo', ca: 'heliantem' , en: "common rock-rose", zh: '' } },
  { foto: '2014/11/Hepatica-nobilis-1.jpg', cientifico: 'Hepatica nobilis', familia: 'Ranunculaceae', nombre: { es: 'hepática', ca: 'herba fetgera' , en: "liverleaf", zh: '獐耳细辛' } },
  { foto: '2014/11/Ipomoea-carnea.jpg', cientifico: 'Ipomoea carnea', familia: 'Convolvulaceae', nombre: { es: '', ca: '' , en: "", zh: '树牵牛' } },
  { foto: '2014/11/Koeleria-vallesiana.jpg', cientifico: 'Koeleria vallesiana', familia: 'Poaceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/11/Leuzea-conifera.jpg', cientifico: 'Leuzea conifera', familia: 'Asteraceae', nombre: { es: 'cuchara de pastor', ca: '' , en: "cone knapweed", zh: '' } },
  { foto: '2014/11/Linaria-arabiniana-2.jpg', cientifico: 'Linaria', familia: 'Plantaginaceae', nombre: { es: 'linaria', ca: 'linària' , en: "toadflax", zh: '柳穿鱼属' } },
  { foto: '2014/11/Linaria-arabiniana.jpg', cientifico: 'Linaria', familia: 'Plantaginaceae', nombre: { es: 'linaria', ca: 'linària' , en: "toadflax", zh: '柳穿鱼属' } },
  { foto: '2014/11/Linum-suffruticosum.jpg', cientifico: 'Linum suffruticosum', familia: 'Linaceae', nombre: { es: 'lino blanco', ca: 'lli blanc' , en: "white flax", zh: '' } },
  { foto: '2014/11/Linum-usitatissimun.jpg', cientifico: 'Linum usitatissimum', familia: 'Linaceae', nombre: { es: 'lino', ca: 'lli' , en: "flax", zh: '亚麻' } },
  { foto: '2014/11/madre-selva.jpg', cientifico: 'Lonicera', familia: 'Caprifoliaceae', nombre: { es: 'madreselva', ca: 'lligabosc' , en: "honeysuckle", zh: '忍冬属' } },
  { foto: '2014/11/Margarita-Bellis.jpg', cientifico: 'Bellis perennis', familia: 'Asteraceae', nombre: { es: 'margarita', ca: 'margarida' , en: "daisy", zh: '雏菊' } },
  { foto: '2014/11/Merendera-bulbocodium.jpg', cientifico: 'Merendera bulbocodium', familia: 'Colchicaceae', nombre: { es: 'quitameriendas', ca: '' , en: "", zh: '' } },
  { foto: '2014/11/Muscaris-nazarenos.jpg', cientifico: 'Muscari neglectum', familia: 'Asparagaceae', nombre: { es: 'nazareno', ca: 'calabruixa' , en: "grape hyacinth", zh: '葡萄风信子' } },
  { foto: '2014/11/Nigella-damascena-arañuela.jpg', cientifico: 'Nigella damascena', familia: 'Ranunculaceae', nombre: { es: 'arañuela', ca: '' , en: "love-in-a-mist", zh: '黑种草' } },
  { foto: '2014/11/Onobrychis-stenorhiza.jpg', cientifico: 'Onobrychis stenorhiza', familia: 'Fabaceae', nombre: { es: 'esparceta', ca: 'trepadella' , en: "sainfoin", zh: '' } },
  { foto: '2014/11/Ononis-natrix.jpg', cientifico: 'Ononis natrix', familia: 'Fabaceae', nombre: { es: '', ca: '' , en: "yellow restharrow", zh: '' } },
  { foto: '2014/12/Papaver-rhoeas-amapolas.jpg', cientifico: 'Papaver rhoeas', familia: 'Papaveraceae', nombre: { es: 'amapola', ca: 'rosella' , en: "common poppy", zh: '虞美人' } },
  { foto: '2014/12/Papaver-Rupifragum-amapola.jpg', cientifico: 'Papaver rupifragum', familia: 'Papaveraceae', nombre: { es: 'amapola', ca: 'rosella' , en: "Spanish poppy", zh: '' } },
  { foto: '2014/12/Petrorhagia-prolifera-clave.jpg', cientifico: 'Petrorhagia prolifera', familia: 'Caryophyllaceae', nombre: { es: '', ca: '' , en: "proliferous pink", zh: '' } },
  { foto: '2014/12/Phlomis-purpurea.jpg', cientifico: 'Phlomis purpurea', familia: 'Lamiaceae', nombre: { es: 'matagallo', ca: '' , en: "purple phlomis", zh: '' } },
  { foto: '2014/12/Phlomis.jpg', cientifico: 'Phlomis lychnitis', familia: 'Lamiaceae', nombre: { es: 'candilera, oreja de burro', ca: 'candelera' , en: "lampwick plant", zh: '' } },
  { foto: '2014/12/Plantago-lagopus.jpg', cientifico: 'Plantago lagopus', familia: 'Plantaginaceae', nombre: { es: 'llantén', ca: 'plantatge' , en: "hare's-foot plantain", zh: '' } },
  { foto: '2014/12/Potentilla-neumanniana.jpg', cientifico: 'Potentilla neumanniana', familia: 'Rosaceae', nombre: { es: 'cincoenrama', ca: '' , en: "spring cinquefoil", zh: '' } },
  { foto: '2014/12/Almendro.jpg', cientifico: 'Prunus dulcis', familia: 'Rosaceae', nombre: { es: 'almendro', ca: 'ametler' , en: "almond", zh: '扁桃' } },
  { foto: '2014/12/Ranunculus-repens.jpg', cientifico: 'Ranunculus repens', familia: 'Ranunculaceae', nombre: { es: 'botón de oro', ca: "botó d'or" , en: "creeping buttercup", zh: '匍枝毛茛' } },
  { foto: '2014/12/rosa-canina-2.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose", zh: '犬蔷薇' } },
  { foto: '2014/12/rosa-canina.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose", zh: '犬蔷薇' } },
  { foto: '2014/12/rosa-canina-1.jpg', cientifico: 'Rosa canina', familia: 'Rosaceae', nombre: { es: 'escaramujo, rosal silvestre', ca: 'roser gavarrer' , en: "dog rose", zh: '犬蔷薇' } },
  { foto: '2014/12/Salvia-pratensis.jpg', cientifico: 'Salvia pratensis', familia: 'Lamiaceae', nombre: { es: 'salvia de prado', ca: 'sàlvia de prat' , en: "meadow clary", zh: '草原鼠尾草' } },
  { foto: '2014/12/Scabiosa-atropurpurea.jpg', cientifico: 'Scabiosa atropurpurea', familia: 'Dipsacaceae', nombre: { es: 'escabiosa', ca: 'escabiosa' , en: "sweet scabious", zh: '紫盆花' } },
  { foto: '2014/12/Scabiosa-atropurpurea-2.jpg', cientifico: 'Scabiosa atropurpurea', familia: 'Dipsacaceae', nombre: { es: 'escabiosa', ca: 'escabiosa' , en: "sweet scabious", zh: '紫盆花' } },
  { foto: '2014/12/Scabiosa-menor.jpg', cientifico: 'Scabiosa', familia: 'Dipsacaceae', nombre: { es: 'escabiosa menor', ca: 'escabiosa menuda' , en: "scabious", zh: '蓝盆花属' } },
  { foto: '2014/12/Sedun-acre.jpg', cientifico: 'Sedum acre', familia: 'Crassulaceae', nombre: { es: 'pampajarito', ca: 'crespinell' , en: "biting stonecrop", zh: '' } },
  { foto: '2014/12/Sedun-sediforme.jpg', cientifico: 'Sedum sediforme', familia: 'Crassulaceae', nombre: { es: 'uña de gato', ca: 'crespinell gros' , en: "pale stonecrop", zh: '' } },
  { foto: '2014/12/Sideretis-hirsuta.jpg', cientifico: 'Sideritis hirsuta', familia: 'Lamiaceae', nombre: { es: 'rabo de gato', ca: 'rabet de gat' , en: "ironwort", zh: '' } },
  { foto: '2014/12/Silene-andryalifolia.jpg', cientifico: 'Silene andryalifolia', familia: 'Caryophyllaceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/12/Silene-vulgaris.jpg', cientifico: 'Silene vulgaris', familia: 'Caryophyllaceae', nombre: { es: 'colleja', ca: 'colitx' , en: "bladder campion", zh: '白玉草' } },
  { foto: '2014/12/Thalictrum-tuberosum-1.jpg', cientifico: 'Thalictrum tuberosum', familia: 'Ranunculaceae', nombre: { es: '', ca: '' , en: "", zh: '' } },
  { foto: '2014/12/Tragopogon-crocifolius.jpg', cientifico: 'Tragopogon crocifolius', familia: 'Asteraceae', nombre: { es: 'barba cabruna', ca: '' , en: "goat's-beard", zh: '' } },
  { foto: '2014/12/Tragopogon-trapensis.jpg', cientifico: 'Tragopogon', familia: 'Asteraceae', nombre: { es: 'barba cabruna', ca: '' , en: "goat's-beard", zh: '婆罗门参属' } },
  { foto: '2014/12/Ulex-parviflorus-aliaga.jpg', cientifico: 'Ulex parviflorus', familia: 'Fabaceae', nombre: { es: 'aliaga', ca: 'argelaga' , en: "Mediterranean gorse", zh: '' } },
  { foto: '2014/12/Urospermun-dalechampii.jpg', cientifico: 'Urospermum dalechampii', familia: 'Asteraceae', nombre: { es: '', ca: 'amargot' , en: "", zh: '' } },
  { foto: '2014/12/Verbascum-pulverulentum.jpg', cientifico: 'Verbascum pulverulentum', familia: 'Scrophulariaceae', nombre: { es: 'gordolobo', ca: 'blenera' , en: "hoary mullein", zh: '' } },
  { foto: '2014/12/Viola-sylvestris-violeta.jpg', cientifico: 'Viola sylvestris', familia: 'Violaceae', nombre: { es: 'violeta', ca: 'violeta de bosc' , en: "wood violet", zh: '' } },
];
