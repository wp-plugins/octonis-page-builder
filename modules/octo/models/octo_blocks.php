<?php
class octo_blocksModelOct extends modelOct {
	private $_ignoreTblBindings = false;
	//private $_tblCategories = 'octo_blocks_categories';
	public function __construct() {
		$this->_setTbl('octo_blocks');
		//$this->_setIdField('sup_octo_blocks.id');
	}
	public function remove($id) {
		$id = (int) $id;
		if($id) {
			if(frameOct::_()->getTable( $this->_tbl )->delete(array('id' => $id))) {
				return true;
			} else
				$this->pushError (__('Database error detected', OCT_LANG_CODE));
		} else
			$this->pushError(__('Invalid ID', OCT_LANG_CODE));
		return false;
	}
	/**
	 * Do not remove pre-set templates
	 */
	public function clear() {
		if(frameOct::_()->getTable( $this->_tbl )->delete(array('additionalCondition' => 'original_id != 0'))) {
			return true;
		} else 
			$this->pushError (__('Database error detected', OCT_LANG_CODE));
		return false;
	}
	protected function _buildQuery($table = null) {
		if(empty($this->_sortOrder) && empty($this->_orderBy)) {
			$this->setOrderBy('sort_order')->setSortOrder('ASC');
		}
		if($this->_ignoreTblBindings)
			return parent::_buildQuery( $table );
		$this->_selectFields = 'sup_octo_blocks.*, @__octo_blocks_categories.label AS cat_label, @__octo_blocks_categories.code AS cat_code';
		if(isset($this->_where['id'])) {
			$this->_where['additionalCondition'] = 'sup_octo_blocks.id = "'. $this->_where['id']. '"';
			unset($this->_where['id']);
		}
		parent::_buildQuery( $table );
		if(!$table)
			$table = frameOct::_()->getTable( $this->_tbl );
		$table->addJoin("INNER JOIN @__octo_blocks_categories ON @__octo_blocks_categories.id = sup_octo_blocks.cid");
	}
	private function _afterDbParams($params) {
		if(empty($params)) return $params;
		if(is_array($params)) {
			foreach($params as $k => $v) {
				$params[ $k ] = $this->_afterDbParams($v);
			}
			return $params;
		} else
			return stripslashes ($params);
	}
	protected function _afterGetFromTbl($row) {
		if($this->_ignoreTblBindings)
			return $row;
		static $imgsPath = false;
		if(!$imgsPath) {
			$imgsPath = $this->getModule()->getAssetsUrl(). 'img/blocks/';
		}
		$row['params'] = empty($row['params']) ? array() : utilsOct::unserialize(base64_decode($row['params']), true);
		$row['params'] = $this->_afterDbReplace($this->_afterDbParams( $row['params'] ));
		
		$row = $this->_afterDbReplace($row);
		$row['img_url'] = isset($row['img']) && !empty($row['img']) 
			? $imgsPath. $row['img'] 
			: $imgsPath. strtolower(str_replace(array(' ', '.'), '-', $row['label'])). '.jpg';
		$row['id'] = (int) $row['id'];
		$row['cid'] = (int) $row['cid'];
		$row['oid'] = isset($row['oid']) ? (int) $row['oid'] : 0;
		$row['original_id'] = (int) $row['original_id'];
		$row['sort_order'] = (int) $row['sort_order'];
		if(!isset($row['session_id'])) {
			$row['session_id'] = mt_rand(1, 999999);
		}
		if(!isset($row['view_id'])) {
			$row['view_id'] = 'octBlock_'. $row['session_id'];
		}
		if($row['cat_code'] == 'subscribes') {
			$row['sub_form_start'] = frameOct::_()->getModule('subscribe')->generateFormStart( $row );
			$row['sub_form_end'] = frameOct::_()->getModule('subscribe')->generateFormEnd( $row );
			
			$row['params']['fields']['val'] = isset($row['params']['fields']) && !empty($row['params']['fields']['val'])
				? utilsOct::jsonDecode($row['params']['fields']['val'])
				: array();
			//var_dump( $row['params']['fields']['val'] );
		}
		return $row;
	}
	public function getOriginalBlocks() {
		$data = $this->addWhere(array('original_id' => 0))->getFromTbl();
		return $data;
	}
	public function getOriginalBlocksByCategories() {
		$res = array();
		$catIdToIter = array();
		$blocks = $this->getOriginalBlocks();
		$i = 0;
		foreach($blocks as $b) {
			if(isset($catIdToIter[ $b['cid'] ])) {
				$res[ $catIdToIter[ $b['cid'] ] ]['blocks'][] = $b;
			} else {
				$catIdToIter[ $b['cid'] ] = $i;
				$catIcon = strtolower(str_replace(array(' ', '.', ','), '-', $b['cat_code']));
				$res[ $catIdToIter[ $b['cid'] ] ] = array(
					'id' => $b['cid'],
					'label' => $b['cat_label'],
					'icon_url' => $this->getModule()->getModPath(). 'img/categories/'. $catIcon. '.png',
					'blocks' => array(
						$b,
					),
				);
				$i++;
			}
		}
		return $res;
	}
	public function save($d = array(), $oid = 0) {
		$id = isset($d['id']) ? (int) $d['id'] : 0;
		if($id) {
			$saveData = array(
				'params' => isset($d['params']) ? $d['params'] : array(),
				'sort_order' => $d['sort_order'],
				'html' => $d['html'],
			);
			return $this->updateById( $saveData, $id );
		} else {
			// Create from original block
			$originalId = isset($d['original_id']) ? (int) $d['original_id'] : 0;
			if($originalId && ($originalBlock = $this->getById( $originalId ))) {
				$originalBlock = $this->_escTplData( $originalBlock );
				unset( $originalBlock['id'] );
				unset( $originalBlock['date_created'] );
				$originalBlock['params'] = isset($d['params']) ? $d['params'] : array();
				$originalBlock['sort_order'] = $d['sort_order'];
				$originalBlock['original_id'] = $originalId;
				$originalBlock['oid'] = $oid;
				$originalBlock['html'] = $d['html'];
				return $this->insert( $originalBlock );
			} else
				$this->pushError(__('Invalid Original ID', OCT_LANG_CODE));
		}
		return false;
	}
	public function getIdSortData($oid) {
		$this->_ignoreTblBindings = true;
		$data = $this->setSelectFields('id, sort_order')->addWhere(array('oid' => $oid))->getFromTbl();
		$this->_ignoreTblBindings = false;
		return $data;
	}
	protected function _beforeDbReplace($data) {
		static $modUrl, $siteUrl;
		if(is_array($data)) {
			foreach($data as $k => $v) {
				$data[ $k ] = $this->_beforeDbReplace($v);
			}
		} else {
			if(!$modUrl)
				$modUrl = $this->getModule()->getModPath();
			if(!$siteUrl)
				$siteUrl = OCT_SITE_URL;
			/*Tmp fix - for quick replace all mode URL to assets URL*/
			$data = str_replace($modUrl, $this->getModule()->getAssetsUrl(), $data);
			/*****/
			$data = str_replace(array($modUrl, $siteUrl, $this->getModule()->getAssetsUrl()), array('[OCT_MOD_URL]', '[OCT_SITE_URL]', '[OCT_ASSETS_URL]'), $data);
			//$data = str_replace($siteUrl, '[OCT_SITE_URL]', str_replace($modUrl, '[PPS_MOD_URL]', $data));
		}
		return $data;
	}
	protected function _afterDbReplace($data) {
		static $modUrl, $siteUrl;
		if(is_array($data)) {
			foreach($data as $k => $v) {
				$data[ $k ] = $this->_afterDbReplace($v);
			}
		} else {
			if(!$modUrl)
				$modUrl = $this->getModule()->getModPath();
			if(!$siteUrl)
				$siteUrl = OCT_SITE_URL;
			$data = str_replace(array('[OCT_MOD_URL]', '[OCT_SITE_URL]', '[OCT_ASSETS_URL]'), array($modUrl, $siteUrl, $this->getModule()->getAssetsUrl()), $data);
			//$data = str_replace('[PPS_SITE_URL]', $siteUrl, str_replace('[PPS_MOD_URL]', $modUrl, $data));
		}
		return $data;
	}
	protected function _dataSave($data, $update = false) {
		$data = $this->_beforeDbReplace($data);
		if(isset($data['params'])) {
			//var_dump($data['params']['fields']['val']);
			if(isset($data['params']['fields'])) {
				/*$data['params']['fields']['val'] = utilsOct::jsonEncode(isset($data['params']['fields']['val']) && !empty($data['params']['fields']['val'])
					? $data['params']['fields']['val']
					: array());*/
			}
			//var_dump($data['params']['fields']['val']);
			$data['params'] = base64_encode(utilsOct::serialize($data['params']));
		}
		return $data;
	}
	protected function _escTplData($data) {
		$data['html'] = dbOct::escape($data['html']);
		$data['css'] = dbOct::escape($data['css']);
		return $data;
	}
	public function getCategoriesList($d = array()) {
		return frameOct::_()->getTable('octo_blocks_categories')->get('*', $d);
	}
	public function generateUniqueId() {
		$uid = utilsOct::getRandStr( 8 );
		if(frameOct::_()->getTable($this->_tbl)->get('COUNT(*) AS total', array('unique_id' => $uid, 'original_id' => 0), '', 'one')) {
			return $this->generateUniqueId();
		}
		return $uid;
	}
}
