// models/Brand.js
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('Brand', brandSchema);