export class ReportGeneratorRefactored {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateReport(reportType, user, items) {
    let report = this.buildHeader(reportType, user);
    let total = 0;

    for (const item of items) {
      this.applyAdminPriority(user, item);

      if (!this.shouldIncludeItem(user, item)) {
        continue;
      }

      report += this.renderItemRow(reportType, item, user);
      total += item.value;
    }

    report += this.buildFooter(reportType, total);

    return report.trim();
  }

  buildHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
      );
    }

    return '';
  }

  buildFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }

    return '';
  }

  applyAdminPriority(user, item) {
    if (user.role === 'ADMIN' && item.value > 1000) {
      item.priority = true;
    }
  }

  shouldIncludeItem(user, item) {
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'USER') {
      return item.value <= 500;
    }

    return false;
  }

  renderItemRow(reportType, item, user) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }

    if (reportType === 'HTML') {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    return '';
  }
}