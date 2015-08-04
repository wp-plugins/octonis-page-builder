<?php
class octoModelOct extends modelOct {
	public function __construct() {
		$this->_setTbl('octo');
	}
	/*protected function _escTplData($data) {
		$data['html'] = dbOct::escape($data['html']);
		$data['css'] = dbOct::escape($data['css']);
		return $data;
	}*/
	public function remove($id) {
		$id = (int) $id;
		if($id) {
			if(frameOct::_()->getTable( $this->_tbl )->delete(array('pid' => $id))) {
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
	public function switchActive($d = array()) {
		$d['active'] = isset($d['active']) ? (int)$d['active'] : 0;
		$d['id'] = isset($d['id']) ? (int) $d['id'] : 0;
		if(!empty($d['id'])) {
			$tbl = $this->getTbl();
			return frameOct::_()->getTable($tbl)->update(array(
				'active' => $d['active'],
			), array(
				'id' => $d['id'],
			));
		} else
			$this->pushError (__('Invalid ID', OCT_LANG_CODE));
		return false;
	}
	public function isPostConverted($pid) {
		return frameOct::_()->getTable( $this->getTbl() )->exists($pid, 'pid');
	}
	public function getForPost($pid) {
		$octo = $this->setWhere(array('pid' => $pid))->getFromTbl(array('return' => 'row'));
		if($octo) {
			$octo['blocks'] = $this->getBlocksForOcto($octo['id']);
			return $octo;
		}
		return false;
	}
	public function getBlocksForOcto($oid) {
		$blocksModel = $this->getModule()->getModel('octo_blocks');
		return $blocksModel->addWhere(array('oid' => $oid))->getFromTbl();
	}
	public function convertToOcto($d = array()) {
		$pid = isset($d['pid']) ? (int) $d['pid'] : 0;
		if($pid) {
			return $this->insert(array(
				'pid' => $pid,
			));
		} else
			$this->pushError(__('Invalid Post ID', OCT_LANG_CODE));
		return false;
	}
	public function returnFromOcto($d = array()) {
		$pid = isset($d['pid']) ? (int) $d['pid'] : 0;
		if($pid) {
			return $this->remove( $pid );
		} else
			$this->pushError(__('Invalid Post ID', OCT_LANG_CODE));
		return false;
	}
	protected function _retrieveData($params = array()) {
		add_filter('posts_join_request', array($this, 'joinOctoTableToPosts'));
		add_filter('posts_where_request', array($this, 'whereOctoTableToPosts'));
		add_filter('posts_fields_request', array($this, 'fieldsOctoTableToPosts'));
		$res = array();
		$getPostsArgs = array(
			'posts_per_page'   => 5,
			'offset'           => 0,
			'orderby'          => 'post_date',
			'order'            => 'DESC',
			'post_type'        => 'any',
			'post_status'      => 'any',
			'suppress_filters' => false 
		);
		if(!empty($this->_orderBy)) {
			$getPostsArgs['orderby'] = $this->_orderBy;
			if(!empty($this->_sortOrder)) {
				$getPostsArgs['order'] = strtoupper($this->_sortOrder);
			}
		}
		if(!empty($this->_limit)) {
			$limitStartLimit = array_map('trim', explode(',', $this->_limit));
			if(isset($limitStartLimit[1])) {
				$getPostsArgs['offset'] = $limitStartLimit[0];
				$getPostsArgs['posts_per_page'] = $limitStartLimit[1];
			} else
				$getPostsArgs['posts_per_page'] = $limitStartLimit[0];
		}
		$postsArray = get_posts( $getPostsArgs );
		if($postsArray) {
			$return = isset($params['return']) ? $params['return'] : 'all';
			$i = 0;
			foreach($postsArray as $p) {
				$res[ $i ] = toeObjectToArray( $p );
				$i++;
			}
			if($return == 'row') {
				$res = array_shift( $res );
			}
		}
		remove_filter('posts_fields_request', array($this, 'fieldsOctoTableToPosts'));
		remove_filter('posts_where_request', array($this, 'whereOctoTableToPosts'));
		remove_filter('posts_join_request', array($this, 'joinOctoTableToPosts'));
		return $res;
	}
	public function joinOctoTableToPosts($join) {
		global $wpdb;
		$join .= dbOct::prepareQuery(" INNER JOIN @__octo ON $wpdb->posts.ID = @__octo.pid");
        return $join;
	}
	public function whereOctoTableToPosts($where) {
		$where .= dbOct::prepareQuery(" AND @__octo.`active` = 1 ");
		if(!empty($this->_where)) {
			if(is_array($this->_where)) {
				foreach($this->_where as $k => $v) {
					$where .= dbOct::prepareQuery(" AND @__octo.`$k` = '$v'");
				}
			} else {
				$where .= dbOct::prepareQuery(" AND $this->_where");
			}
		}
		return $where;
	}
	public function fieldsOctoTableToPosts($fields) {
		$addFields = array_map(array('dbOct', 'prepareQuery'), array('@__octo.id'));
		$fields .= ','. implode(',', $addFields);
		return $fields;
	}
	public function save($data = array()) {
		$oid = isset($data['id']) ? (int) $data['id'] : 0;
		if($oid) {
			// TODO: Add remove blocks here
			$blocksModel = $this->getModule()->getModel('octo_blocks');
			$currentBlockIds = array();
			$idSortArr = $blocksModel->getIdSortData($oid);
			if(!empty($idSortArr)) {
				foreach($idSortArr as $idSortData) {
					$currentBlockIds[ $idSortData['id'] ] = 1;
				}
			}
			if(isset($data['blocks']) && !empty($data['blocks'])) {
				foreach($data['blocks'] as $b) {
					if(!$blocksModel->save($b, $oid)) {
						$this->pushError( $blocksModel->getErrors() );
						return false;
					} else {
						if(isset($b['id']) && $b['id'] && isset($currentBlockIds[ $b['id'] ])) {
							unset( $currentBlockIds[ $b['id'] ] );
						}
					}
				}
			}
			if(!empty($currentBlockIds)) {
				$blocksModel->removeGroup(array_keys( $currentBlockIds ));
			}
			return true;
		} else
			$this->pushError (__('Invalid Octo ID', OCT_LANG_CODE));
		return false;
	}
	
}
