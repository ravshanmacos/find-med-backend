const path = require('path');
const data = require(path.join(__dirname, 'data', 'uzbekistan-regions.json'));

exports.seed = async function (knex) {
  await knex('districts').del();
  await knex('regions').del();

  for (const region of data.regions) {
    const [{ id: regionId }] = await knex('regions')
      .insert({ name: region.name })
      .returning('id');

    if (region.districts.length > 0) {
      await knex('districts').insert(
        region.districts.map((name) => ({ name, region_id: regionId })),
      );
    }
  }
};
