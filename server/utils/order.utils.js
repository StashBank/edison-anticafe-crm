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
			}, {
				model: Tariff,
				as: 'children',
				attributes: ['id', 'name', 'cost', 'position']
			}]
		});
		return tariff;
	}
	costHour(order, tariff) {
		const duration = this.getDuration(order);
		let totalHours = duration / SECONDS_IN_HOURS;
		if (!tariff.children) {
			return totalHours * tariff.cost || 0;
		}
		const hours = parseInt(totalHours);
		const seconds = totalHours - hours;
		const hourTimes = new Array(hours).fill(1);
		hourTimes.push(seconds);
		const subTariffs = tariff.children.slice()
			.sort((v1, v2) => v1.position > v2.position);
		return hourTimes.reduce((p,c) => {
			const subTariff = subTariffs.shift();
			const cost = subTariff ? subTariff.cost : tariff.cost;
			p += c * cost;
			return p;
		}, 0);

	}
	costOnce(order, tariff) {
		return tariff.cost || 0;
	}
	getDuration(order) {
		const timeline = order.timeline;
		const currentDate = new Date();
		const miliseconds = timeline.timelines.reduce((p,c) => {
			const endDate = c.endDate || currentDate;
			const startDate = c.startDate || endDate;
			return endDate - startDate;
		}, 0);
		const seconds =  miliseconds / MILISECONDS_IN_SECONDS;
		return seconds;
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