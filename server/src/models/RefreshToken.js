import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * RefreshToken — DB-stored hashed refresh tokens for explicit revocation.
 *
 * Tokens are SHA-256 hashed before storage (the raw token is only known to the
 * client). A TTL index on `expiresAt` tells MongoDB to auto-delete expired
 * documents, so no manual cleanup job is needed.
 *
 * `userModel` discriminates between 'User' (customer) and 'Admin' so both
 * account types can share one collection.
 */
const refreshTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, required: true, refPath: 'userModel' },
    userModel: { type: String, required: true, enum: ['User', 'Admin'] },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
