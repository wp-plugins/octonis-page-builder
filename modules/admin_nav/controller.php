<?php
class admin_navControllerOct extends controllerOct {
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array()
			),
		);
	}
}