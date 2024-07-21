const checkOwnership = async (model, id, userId) => {
  const item = await model.findById(id);
  if (!item) {
    return { error: "Item not found", item: null };
  }
  if (item.owner.toString() !== userId) {
    return {
      error: "You are not authorized to perform this action",
      item: null,
    };
  }
  return { error: null, item };
};

module.exports = checkOwnership;
