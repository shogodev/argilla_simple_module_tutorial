<?php
/**
 * @author Nikita Melnikov <melnikov@shogo.ru>
 * @link https://github.com/shogodev/argilla/
 * @copyright Copyright &copy; 2003-2013 Shogo
 * @license http://argilla.ru/LICENSE
 *
 * @var WarrantyArticle[] $articles
 * @var WarrantyController $this
 */

/**
 * @HINT: А еще тут можно использовать FListView
 */
?>

<?php if( !empty($articles) ): ?>
  <?php foreach($articles as $article): ?>
    <div class="article">
      <div class="name">
        <a href="<?php echo $this->createUrl('warranty/article', ['id' => $article->id]);?>">
          <?php echo $article->name;?>
        </a>
      </div>
      <div class="notice"><?php echo $article->content;?></div>
    </div>
  <?php endforeach; ?>
<?php else: ?>
  <div class="empty">
    нет данных для отображения
  </div>
<?php endif; ?>