const bcrypt = require('bcryptjs')

exports.seed = async function(knex) {
  await knex("users").insert([
    {id: 1, username: "test", password: await bcrypt.hash("poopsword", 14)}
  ])
};
