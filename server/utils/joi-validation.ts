import Joi from "joi"


const idParamSchema = Joi.object({
    id: Joi.string().pattern(/^\d+$/).required()
})

export { idParamSchema };