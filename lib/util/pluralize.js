var singularRules = [],
    pluralizeRules = [],
    // Using objects for fast lookups
    uncountables   = {},
    irregular      = {},
    sanitizeWord, sanitizeRule,
    pluralize,
    plural,
    singular;


  /**
   *
   * Pluralize, the main method to pluralize any string.
   * usage: pluralize('watch') => watches
   *
   */

pluralize = exports.inflect = function (word) {

  return plural(word);
};

plural = plural = function (word) {
  
  var word = word.trim().toLowerCase();

  if (irregular[word]) { return irregular[word] }

  var found;
  Object.keys(irregular).some(function (singular) {
    if (irregular[singular] === word) {
      return found = word;
    }
  });
  if (found) { return found }

  return sanitizeWord(word, pluralizeRules);
};

sanitizeRule = function (rule) {
  if (typeof rule === 'string') {
    return new RegExp('^' + rule + '$', 'i');
  }
  return rule;
};

// Conveniently, the word will always lowercased when passes in here
sanitizeWord = function (word, collection) {
  if (word.length < 2) { return word; } // Empty string or no word to fix

  var found, match;
  if (typeof uncountables[word] === 'undefined') {
    found = collection.some(function (rule) {
      match = rule;
      return word.match(rule[0]);
    });
    if (found) {
      return word.replace(match[0], match[1]);
    }
  }
  return word;
};


addPluralRule = function (rule, replacement) {
  pluralizeRules.unshift([ sanitizeRule(rule), replacement ]);
};

addUncountableRule = function (word) {
  if (typeof word === 'string') {
    return uncountables[word.toLowerCase()] = true;
  }

  // Set singular and plural references for the word
  addPluralRule(word, '$&');
};

addIrregularRule = function (singular, plural) {
  irregular[singular] = plural; // Hashed pattern for faster lookup
};

// Pronouns
addIrregularRule('i', 'we');
addIrregularRule('me', 'us');
addIrregularRule('he', 'they');
addIrregularRule('she', 'they');
addIrregularRule('them', 'them');
addIrregularRule('myself', 'ourselves');
addIrregularRule('yourself', 'yourselves');
addIrregularRule('itself', 'themselves');
addIrregularRule('herself', 'themselves');
addIrregularRule('himself', 'themselves');
addIrregularRule('themself', 'themselves');
// Words ending in with a consonant and `o`
addIrregularRule('canto', 'cantos');
addIrregularRule('hetero', 'heteros');
addIrregularRule('photo', 'photos');
addIrregularRule('zero', 'zeros');
addIrregularRule('piano', 'pianos');
addIrregularRule('portico', 'porticos');
addIrregularRule('pro', 'pros');
addIrregularRule('quarto', 'quartos');
addIrregularRule('kimono', 'kimonos');
// Anything else
addIrregularRule('ox', 'oxen');
addIrregularRule('die', 'dice');
addIrregularRule('foot', 'feet');
addIrregularRule('goose', 'geese');
addIrregularRule('quiz', 'quizzes');
addIrregularRule('human', 'humans');
addIrregularRule('proof', 'proofs');
addIrregularRule('carve', 'carves');
addIrregularRule('valve', 'valves');
addIrregularRule('thief', 'thieves');
addIrregularRule('groove', 'grooves');
addIrregularRule('stigma', 'stigmata');
// Ends with `us`
addIrregularRule('genus', 'genera');
addIrregularRule('viscus', 'viscera');
addIrregularRule('syllabus', 'syllabi');

addPluralRule(/$/, 's');
addPluralRule(/s$/, 's');
addPluralRule(/(ese)$/, '$1');
addPluralRule(/^(ax|test)is$/, '$1es');
addPluralRule(/([au]s)$/, '$1es');
addPluralRule(/(e[mn]u)s?$/, '$1s');
addPluralRule(/([^l]ias|[aeiou]las|[emjzr]as)$/, '$1');
addPluralRule(/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc)(us|i)$/, '$1i');
addPluralRule(/^(alumn|alg|vertebr)(a|ae)$/, '$1ae');
addPluralRule(/(bu)s$/, '$1ses');
addPluralRule(/([^aeiou])o$/, '$1oes');
addPluralRule(/^(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)(a|um)$/, '$1a');
addPluralRule(/^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)(a|on)$/, '$1a');
addPluralRule(/sis$/, 'ses');
addPluralRule(/(?:([^f])fe|(ar|l|[eo][ao])f)$/, '$1$2ves');
addPluralRule(/([^aeiouy]|qu)y$/, '$1ies');
addPluralRule(/(x|ch|ss|sh|zz)$/, '$1es');
addPluralRule(/(matr|cod|mur|sil|vert|ind)(ix|ex)$/, '$1ices');
addPluralRule(/^(m|l)(ice|ouse)$/, '$1ice');
addPluralRule(/(pe)(rson|ople)$/, '$1ople');
addPluralRule(/(child)(ren)?$/, '$1ren');
addPluralRule(/(eau)x?$/, '$1x');
addPluralRule(/m(a|e)n$/, 'men');


// http://en.wikipedia.org/wiki/English_plural#Singulars_without_plurals
[
'advice', 'agenda', 'bison', 'bream', 'buffalo', 'carp', 'chassis',
'cod', 'cooperation', 'corps', 'digestion', 'debris', 'diabetes',
'energy', 'equipment', 'elk', 'excretion', 'expertise', 'flounder',
'gallows', 'graffiti', 'headquarters', 'health', 'herpes', 'highjinks',
'homework', 'information', 'jeans', 'justice', 'labour', 'machinery',
'mackerel', 'media', 'mews', 'money', 'moose', 'news', 'pike', 'plankton',
'pliers', 'pollution', 'rain', 'rice', 'salmon', 'scissors', 'series',
'sewage', 'shrimp', 'species', 'staff', 'swine', 'trout', 'tuna',
'whiting', 'wildebeest'
].forEach(addUncountableRule);

// Uncountable regexes
addUncountableRule(/pox$/);
addUncountableRule(/ois$/);
addUncountableRule(/deer$/);
addUncountableRule(/fish$/);
addUncountableRule(/sheep$/);
addUncountableRule(/measles$/);
addUncountableRule(/[nrlm]ese$/);