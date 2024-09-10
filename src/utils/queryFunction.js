export const getOneDocument = async (model, filed, value) => {
  const data = await model.findOne({ [filed]: value })
  return data
}
