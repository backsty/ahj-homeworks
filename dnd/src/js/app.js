import PageController from './PageController.js';
import PageUi from './PageUi.js';
import StateService from './StateService.js';
import data from './Utils.js';

const stateService = new StateService(localStorage);
const pageUi = new PageUi(data);
const controller = new PageController(pageUi, stateService);

controller.init();