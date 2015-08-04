<?php
class admin_navViewOct extends viewOct {
	public function getBreadcrumbs() {
		$this->assign('breadcrumbsList', dispatcherOct::applyFilters('mainBreadcrumbs', $this->getModule()->getBreadcrumbsList()));
		return parent::getContent('adminNavBreadcrumbs');
	}
}
