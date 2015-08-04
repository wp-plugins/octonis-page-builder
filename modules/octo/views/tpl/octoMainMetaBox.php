<div class="octActivateForPostShell" <?php if($this->isPostConverted) {?>style="display: none;"<?php }?>>
	<a href="#" class="button button-primary octActivatePostBtn" data-pid="<?php echo $this->post->ID?>">
		<?php _e('Activate Octo', OCT_LANG_CODE)?>
	</a>
</div>
<div class="octPostSettingsShell" <?php if(!$this->isPostConverted) {?>style="display: none;"<?php }?>>
	<a href="#" target="_blank" class="button button-primary octEditTplBtn" data-pid="<?php echo $this->post->ID?>">
		<?php _e('Edit Template', OCT_LANG_CODE)?>
	</a>
	<a href="#" class="button octReturnPostFromOcto" data-pid="<?php echo $this->post->ID?>">
		<?php _e('Deactivate Octo', OCT_LANG_CODE)?>
	</a>
</div>