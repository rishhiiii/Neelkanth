/**
 * Barrel file for all Mongoose models. Models are added here as each schema is
 * finalised (Module 1). Importing from a single place keeps registration order
 * predictable and gives the rest of the app one import surface:
 *
 *   import { User, Product } from '../models/index.js';
 */

// Models will be exported here as they are built, one schema at a time.
export { default as User, INDIAN_STATES } from './User.js';
export { default as Admin } from './Admin.js';
export { default as Product } from './Product.js';
export { default as Category } from './Category.js';
export { default as HealthTag } from './HealthTag.js';
export { default as Cart } from './Cart.js';
export { default as Wishlist } from './Wishlist.js';
export { default as Order } from './Order.js';
export { default as Counter } from './Counter.js';
export { default as RefreshToken } from './RefreshToken.js';
export { default as HeroBanner } from './HeroBanner.js';
export { default as Testimonial } from './Testimonial.js';
export { default as BlogPost } from './BlogPost.js';
