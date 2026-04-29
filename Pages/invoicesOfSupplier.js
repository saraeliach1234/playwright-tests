const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

class InvoicesOfSupplierPage {
  constructor(page) {
    this.page = page;
  }

}