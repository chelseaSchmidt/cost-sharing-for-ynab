const mongoose = require('mongoose');

const sharedAccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
});
const sharedCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
});
const userSchema = mongoose.Schema({
  name: String,
  sharedAccounts: [sharedAccountSchema],
  sharedCategories: [sharedCategorySchema],
});

module.exports = mongoose.model('user', userSchema);
