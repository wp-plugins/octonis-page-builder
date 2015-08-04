<?php
	$alignClass = '';
	if($this->block && $this->block['params'] && isset($this->block['params']['align']) && !empty($this->block['params']['align']['val'])) {
		$alignClass = 'octAlign_'. $this->block['params']['align']['val'];
	}
?>
<div id="{{block.view_id}}" class="octBlock <?php echo $alignClass?>" data-id="<?php echo $this->block ? $this->block['id'] : 0?>">
	<?php if(!$this->block || (isset($this->block['css']) && !empty($this->block['css']))) { ?>
		<style type="text/css" class="octBlockStyle"><?php echo $this->block ? $this->block['css'] : ''?></style>
	<?php }?>
	<?php if(!$this->block || (isset($this->block['html']) && !empty($this->block['html']))) { ?>
		<div class="octBlockContent"><?php echo $this->block ? $this->block['html'] : ''?></div>
	<?php }?>
</div>