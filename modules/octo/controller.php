<?php
class octoControllerOct extends controllerOct {
	private $_prevPopupId = 0;
	public function createFromTpl() {
		$res = new responseOct();
		if(($id = $this->getModel()->createFromTpl(reqOct::get('post'))) != false) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	protected function _prepareListForTbl($data) {
		if(!empty($data)) {
			foreach($data as $i => $v) {
				$data[ $i ]['post_title'] = '<a class="" href="'. get_edit_post_link($data[ $i ]['ID']). '">'. $data[ $i ]['post_title']. '&nbsp;<i class="fa fa-fw fa-pencil" style="margin-top: 2px;"></i></a>';
				$data[ $i ]['actions'] = '<a target="_blank" class="button" href="'. $this->getModule()->getEditLink($data[ $i ]['ID']). '"><i class="fa fa-fw fa-cog"></i></a>';
			}
		}
		return $data;
	}
	protected function _prepareTextLikeSearch($val) {
		$query = '(label LIKE "%'. $val. '%"';
		if(is_numeric($val)) {
			$query .= ' OR id LIKE "%'. (int) $val. '%"';
		}
		$query .= ')';
		return $query;
	}
	public function remove() {
		$res = new responseOct();
		if($this->getModel()->remove(reqOct::getVar('id', 'post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function save() {
		$res = new responseOct();
		$data = reqOct::getVar('data', 'post');
		if($this->getModel()->save( $data )) {
			$res->addData('id_sort_order_data', $this->getModel('octo_blocks')->getIdSortData( $data['id'] ));
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function exportForDb() {
		$eol = "\r\n";
		$selectColumns = array('oid','cid','label','original_id','params','html','css','img','sort_order','is_base','date_created');
		$octoList = dbOct::get('SELECT '. implode(',', $selectColumns). ' FROM @__octo_blocks WHERE original_id = 0');
		$valuesArr = array();
		$allKeys = array();
		foreach($octoList as $octo) {
			$arr = array();
			$addToKeys = empty($allKeys);
			foreach($octo as $k => $v) {
				if(!in_array($k, $selectColumns)) continue;
				if($addToKeys) {
					$allKeys[] = $k;
				}
				$arr[] = '"'. mysql_real_escape_string($v). '"';
			}
			$valuesArr[] = '('. implode(',', $arr). ')';
		}
		$query = 'INSERT INTO @__octo_blocks ('. implode(',', $allKeys). ') VALUES '. $eol. implode(','. $eol, $valuesArr);
		echo $query;
		exit();
	}
	public function saveAsCopy() {
		$res = new responseOct();
		if(($id = $this->getModel()->saveAsCopy(reqOct::get('post'))) != false) {
			$res->addMessage(__('Done, redirecting to new PopUp...', OCT_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function switchActive() {
		$res = new responseOct();
		if($this->getModel()->switchActive(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function convertToOcto() {
		$res = new responseOct();
		if($this->getModel()->convertToOcto(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function returnFromOcto() {
		$res = new responseOct();
		if($this->getModel()->returnFromOcto(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('getListForTbl', 'remove', 'removeGroup', 'clear', 
					'save', 'exportForDb', 'switchActive',
					'convertToOcto', 'returnFromOcto')
			),
		);
	}
}

