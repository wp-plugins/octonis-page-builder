<div class="octActivateForPostShell" <?php if($this->isPostConverted) {?>style="display: none;"<?php }?>>
	<div class="misc-pub-section">
		<a href="#" class="button button-primary octActivatePostBtn" data-pid="<?php echo $this->post->ID?>">
			<?php printf(__('Activate %s', OCT_LANG_CODE), OCT_OUR_NAME)?>
		</a>
	</div>
</div>
<div class="octPostSettingsShell" <?php if(!$this->isPostConverted) {?>style="display: none;"<?php }?>>
	<div class="octPostSettingsContent">
		<div class="misc-pub-section dashicons-screenoptions dashicons-before">
			<?php _e('Blocks usage')?>: <?php echo (string) $this->usedBlocksNumber;?>
		</div>
	</div>
	<div class="octPostSettingsFooter">
		<a href="#" class="octReturnPostFromOcto" data-pid="<?php echo $this->post->ID?>">
			<?php printf(__('Deactivate %s', OCT_LANG_CODE), OCT_OUR_NAME)?>
		</a>
		<a href="#" target="_blank" class="button button-primary octEditTplBtn" data-pid="<?php echo $this->post->ID?>">
			<?php _e('Build Page', OCT_LANG_CODE)?>
		</a>
		<div style="clear: both;"></div>
	</div>
</div>