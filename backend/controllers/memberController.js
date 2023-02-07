const memberService = require('../services/memberService');
const {SuccessResponse} = require("../api-responses/successResponse");

const memberController = {
    getOne: async (req, res) => {
        const member = await memberService.getOne(req.user.id);

        res.status(200).json(new SuccessResponse(member));
    },
    update: async (req, res) => {
        const data = req.validateData;

        const member = await memberService.update(data, req.user.id);

        if (!member) {
            res.sendStatus(404);
            return;
        }

        res.status(201).json(new SuccessResponse(member));
    }
};

module.exports = memberController;