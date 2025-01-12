import Joi from "joi";

const signupSchema = Joi.object({
    username: Joi.string().required()
})

export default signupSchema;