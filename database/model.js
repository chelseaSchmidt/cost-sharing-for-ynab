const mongoose = require('mongoose');

const sharedAccountSchema = mongoose.Schema({
  name: String,
  accountId: String,
});
const sharedCategorySchema = mongoose.Schema({
  name: String,
  categoryId: String,
});
const userSchema = mongoose.Schema({
  name: String,
  sharedAccounts: [sharedAccountSchema],
  sharedCategories: [sharedCategorySchema],
});

module.exports = mongoose.model('user', userSchema);
