const mongoose = require('mongoose');

const MixCacheSchema = new mongoose.Schema({
  first: { type: String, required: true, collation: { locale: 'en', strength: 2 }},
  second: { type: String, required: true, collation: { locale: 'en', strength: 2 }},
  // you can store the prompt too if needed
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure uniqueness on a pair
MixCacheSchema.index({ first: 1, second: 1 }, { unique: true, collation: { locale: 'en', strength: 2 }});

module.exports = mongoose.model('MixCache', MixCacheSchema);

