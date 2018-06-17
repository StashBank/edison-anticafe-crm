const Sequelize = require('sequelize');
const Tariff = require('../models/lookups').Tariff;
const TariffType = require('../models/lookups').TariffType;
const IncomeType = require('../models/lookups').IncomeType;
const Income = require('../models/income').Income;

const SECONDS_IN_HOURS = 60 * 60;
const MILISECONDS_IN_SECONDS = 1000;

class CostHelper {
	async cost(order) {
		const tarrifId = order.product && order.product.tariffId;
		const orderProducts = order.products || [];
		const tariffs = orderProducts.map(p => p.product.tariff);
		if (tarrifId) {
			const tariff = await this.fetchTariffById(tarrifId);
			tariffs.unshift(tariff);
		}
		return tariffs.reduce((cost, tariff) => cost + this.getTariffCost(order, tariff), 0);
	}
	getTariffCost(order, tariff) {
		return tariff.type && tariff.type.code === 'hour' ? this.costHour(order, tariff) : this.costOnce(order, tariff);
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

const getModelObject = (body, model) => {
	const obj = {};
	for (const attribute in body) {
		const column = model.attributes[attribute] || model.attributes[`${attribute}Id`];
		const columnPath = column && column.fieldName;
		if (columnPath && model.tableAttributes.hasOwnProperty(columnPath)) {
			obj[columnPath] = body[attribute];
		}
	}
	return obj;
}

const utils = {
	cost: async order => {
		const costHelper = new CostHelper();
		const cost = await costHelper.cost(order);
		return Math.round(cost * 100) / 100;
	},
	createOrderIncomes: async (order, amount) => {
		const type = await IncomeType.find({
			where: { code: 'order'}
		});
		return Income.create(getModelObject({
			date: new Date(),
			amount,
			typeId: type.id,
			orderId: order.id
		}, Income));
	}
}
module.exports = utils;