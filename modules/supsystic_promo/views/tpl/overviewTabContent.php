<section>
	<div class="supsystic-item supsystic-panel">
		<div id="containerWrapper">
			<div class="supsistic-half-side-box" style="border-right: 1px solid rgba(164, 170, 172, 0.28);">
				<div class="server-settings">
					<h3><?php _e('Server Settings', OCT_LANG_CODE)?></h3>
					<ul class="settings-list">
						<?php foreach($this->serverSettings as $title => $element) {?>
							<li class="settings-line">
								<div class="settings-title"><?php echo $title?>:</div>
								<span><?php echo $element['value']?></span>
							</li>
						<?php }?>
					</ul>
				</div>
			</div>
			<div class="supsistic-half-side-box" style="padding-left: 20px;">
				<div class="overview-contact-form">
					<h3><?php _e('Contact form', OCT_LANG_CODE)?></h3>
					<form id="form-settings">
						<table class="contact-form-table">
							<?php foreach($this->contactFields as $fName => $fData) { ?>
								<?php
									$htmlType = $fData['html'];
									$id = 'contact_form_'. $fName;
									$htmlParams = array('attrs' => 'id="'. $id. '"');
									if(isset($fData['placeholder']))
										$htmlParams['placeholder'] = $fData['placeholder'];
									if(isset($fData['options']))
										$htmlParams['options'] = $fData['options'];
									if(isset($fData['def']))
										$htmlParams['value'] = $fData['def'];
									if(isset($fData['valid']) && in_array('notEmpty', $fData['valid']))
										$htmlParams['required'] = true;
								?>
							<tr>
								<th scope="row">
									<label for="<?php echo $id?>"><?php echo $fData['label']?></label>
								</th>
								<td>
									<?php echo htmlOct::$htmlType($fName, $htmlParams)?>
								</td>
							</tr>
							<?php }?>
							<tr>
								<th scope="row" colspan="2">
									<?php echo htmlOct::hidden('mod', array('value' => 'supsystic_promo'))?>
									<?php echo htmlOct::hidden('action', array('value' => 'sendContact'))?>
									<button class="button button-primary button-hero" style="float: right;">
										<i class="fa fa-upload"></i>
										<?php _e('Send email', OCT_LANG_CODE)?>
									</button>
									<div style="clear: both;"></div>
								</th>
							</tr>
						</table>
					</form>
					<div id="form-settings-send-msg" style="display: none;">
						<i class="fa fa-envelope-o"></i>
						<?php _e('Your email was send, we will try to respond to you as soon as possible. Thank you for support!', OCT_LANG_CODE)?>
					</div>
				</div>
			</div>
			<div style="clear: both;"></div>
		</div>
	</div>
</section>