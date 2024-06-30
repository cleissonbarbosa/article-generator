<?php

/**
 * Block markup
 *
 * @var array    $attributes         Block attributes.
 * @var string   $content            Block content.
 * @var WP_Block $block              Block instance.
 * @var array    $context            Block context.
 */
?>
    <?php if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) : ?>
        <div class="wp-block-article-generator-subject">
            <div class="flex justify-between mb-8">
                <small><?php _e('Article Generator', 'article-gen'); ?></small>
                <small><?php _e('Don\'t worry, only you are seeing this.', 'article-gen')?></small>
            </div>
            <p><?php _e('You have not generated the post content with the article generator block, click on edit and click on generate for the text to be added to the post', 'article-gen'); ?></p>
            <?php if($attributes['prompt'] || $attributes['context']): ?>
                <ul class="mt-5 text-sm">
                    <li>
                        <?php 
                            // translators: %s is equals prompt
                            printf(__('Your prompt: %s', 'article-gen'), $attributes['prompt'] ?? 'empty');
                        ?>
                    </li>
                    <li>
                        <?php
                            // translators: %s is equals context 
                            printf(__('Your context: %s', 'article-gen'), $attributes['context']) ?? 'empty';
                        ?>
                    </li>
                </ul>
            <?php endif; ?>
        </div>
        <p><?php _e('You have not generated the post content with the article generator block, click on edit and click on generate for the text to be added to the post', 'article-gen'); ?></p>
        <?php if ($attributes['prompt'] || $attributes['context']) : ?>
            <ul class="mt-5 text-sm">
                <li><?php printf(__('Your prompt: %s', 'article-gen'), $attributes['prompt'] ?? 'empty'); ?></li>
                <li><?php printf(__('Your context: %s', 'article-gen'), $attributes['context']) ?? 'empty'; ?></li>
            </ul>
        <?php endif; ?>
    </div>
<?php endif; ?>