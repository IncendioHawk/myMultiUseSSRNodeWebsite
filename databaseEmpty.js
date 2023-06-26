module.exports = async function databaseEmpty(database) {
  const length = await database.countDocuments()
  return length === 0
}
