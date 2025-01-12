import Joi from "joi";

const mergeRequestSchema = Joi.object({
    videoIds: Joi.array().items(Joi.number().positive()).min(2)
})

const trimRequestSchema = Joi.object({
    startTime: Joi.string().required(),
    duration: Joi.string().required()
})

export { mergeRequestSchema, trimRequestSchema };