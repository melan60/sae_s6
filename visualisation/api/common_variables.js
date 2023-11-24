// ================================================================================================ models
const genders = ["Masculin", "Féminin"];
const NAME_MIN_SIZE = 3;
const NAME_MAX_SIZE = 50;
const rights = ["admin", "cobaye"];
const USER_PASSWORD_MIN_SIZE = 8;
const USER_PASSWORD_MAX_SIZE = 100;
const USER_EMAIL_MIN_SIZE = 3;
const USER_EMAIL_MAX_SIZE = 60;

// ================================================================================================ error authentification
const params_authentification = "Email ou mot de passe incorrect";

// ================================================================================================ error server-tcp user
const already_registered = "Champs déjà enregistré(s)";

// ================================================================================================ services
const age_category = ["Enfant", "Adolescent", "Adulte", "Personne Agée"];
const not_found = "Élément introuvable";

module.exports = {
  genders,
  NAME_MIN_SIZE,
  NAME_MAX_SIZE,
  rights,
  USER_PASSWORD_MIN_SIZE,
  USER_PASSWORD_MAX_SIZE,
  USER_EMAIL_MIN_SIZE,
  USER_EMAIL_MAX_SIZE,

  params_authentification,
  already_registered,

  age_category,
  not_found,
};
