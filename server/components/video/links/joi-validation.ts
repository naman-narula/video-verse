import Joi from "joi"


const idFileParamSchema = Joi.object({
    filename: Joi.string().required()
})
export default idFileParamSchema;