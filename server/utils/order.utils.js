const Sequelize = require('sequelize');
const Tariff = require('../models/lookups').Tariff;
const TariffType = require('../models/lookups').TariffType;

const SECONDS_IN_HOURS = 60 * 60;
const MILISECONDS_IN_SECONDS = 1000;

class CostHelper {
	async cost(order) {
		const tariff = await this.fetchTariffById(order.product.tariffId);
		if (tariff.type.code === 'hour') {
			return this.costHour(order, tariff);
		}
		return this.costOnce(order, tariff);
	}
	async fetchTariffById(id) {
		const tariff = await Tariff.findById(id, {
			include: [{
				model: TariffType,
				as: 'type',
				attributes: ['id', 'name', 'code']
			},]
		});
		return tariff;
	}
	costHour(order, tariff) {
		const duration = this.getDuration(order);
		const totalHours = duration / SECONDS_IN_HOURS;
		return totalHours * tariff.cost || 0;
	}
	costOnce(order, tariff) {
		return tariff.cost || 0;
	}
	getDuration(order) {
		const timeline = order.timeline;
		const currentDate = new Date();
		const miliseconds = timeline.timelines.reduce((p,c) => {
			console.log(`c.endDate construcotr ? ${c.endDate.constructor}`);
			const endDate = c.endDate || currentDate;
			const startDate = c.startDate || endDate;
			console.log(`c.startDate construcotr ? ${c.startDate.constructor}`);
			return endDate - startDate;
		}, 0);
		console.log(miliseconds);
		return miliseconds / MILISECONDS_IN_SECONDS;
	}
}

const utils = {
	cost: async (order) => {
		const costHelper = new CostHelper();
		const cost = await costHelper.cost(order);
		return Math.round(cost * 100) / 100;
	}
}
module.exports = utils;