import mongoose from "mongoose";
export interface TagAttributes {
  name: string;
}

const tagSchema = new mongoose.Schema<TagAttributes>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const TagModel = mongoose.model<TagAttributes>("Tags", tagSchema);
export default TagModel;
/**
 * @swagger
 * components:
 *    schemas:
 *      Posts:
 *         type: object
 *         required:
 *            - name
 *          properties:
 *            name:
 *              type: string
 *              description: The tag name
 *          example:
 *            name: 'lunch'
 */
