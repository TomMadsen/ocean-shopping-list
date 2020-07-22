const router = require('express').Router();
const pool = require('../db');
const authorizer = require('../middleware/authorizer');

router.get('/', authorizer, async (req, res)=>{
  try {
    const user = await pool.query(`
      SELECT users.user_name, sl.item_id, sl.item, sl.category, sl.list_id, sl.obtained FROM users LEFT JOIN shopping_list AS sl ON users.uid=sl.uid WHERE users.uid = $1`,[
        req.user.id
      ])
    res.json(user.rows);
  } catch (error) {
    res.json('get error')
  }
})

// post a shopping item
router.post('/list', authorizer, async (req, res)=>{
  try {
    const {item, category} = req.body;
    const newItem = await pool.query(`
      INSERT INTO shopping_list (uid, item, category) VALUES ($1, $2, $3) RETURNING *`,[
        req.user.id, item, category
      ]);
    res.json(newItem.rows[0])
  } catch (error) {
    console.error(error.message);
    res.json(error.message )
  }
})

// edit a shopping item
router.put('/list/:id', authorizer, async (req, res)=>{
  try {
    const {id} = req.params;
    const {item, category} = req.body;
    const updatedItem = await pool.query(`
      UPDATE shopping_list SET item =$1, category=$2 WHERE item_id =$3 AND uid =$4 RETURNING *`,[
        item, category, id, req.user.id
      ]);
    if(updatedItem.rows.length===0){
      return res.json('You are trying to update an item not in your list')
    }
    res.json({updated: updatedItem.rows[0]})
  } catch (error) {
    console.error(error.message);
    res.json({'put error: ': error.message })
  }
})

router.put('/listsort/:id', authorizer, async (req, res)=>{
  try {
    const {id} = req.params;
    const {i} = req.body;
    const updatedItem = await pool.query(`
      UPDATE shopping_list SET list_id=$1 WHERE item_id =$2 AND uid =$3 RETURNING *`,[
        i, id, req.user.id
      ]);
    if(updatedItem.rows.length===0){
      return res.json('You are trying to update an item not in your list')
    }
    res.json({updated: updatedItem.rows[0]})
  } catch (error) {
    console.error(error.message);
    res.json({'put error: ': error.message })
  }
})

router.put('/list/obtained/:id', authorizer, async (req, res)=>{
  try {
    const {id} = req.params;
    const {obtained} = req.body;
    const updatedItem = await pool.query(`
      UPDATE shopping_list SET obtained=$1 WHERE item_id =$2 AND uid =$3 RETURNING *`,[
        obtained, id, req.user.id
      ]);
    if(updatedItem.rows.length===0){
      return res.json('You are trying to update an item not in your list')
    }
    res.json({updated: updatedItem.rows[0]})
  } catch (error) {
    console.error(error.message);
    res.json({'put error: ': error.message })
  }
})


//delete a shopping item
router.delete('/list/:id', authorizer, async (req, res)=>{
  try {
    const {id} = req.params;
    const deletedItem = await pool.query(`
      DELETE FROM shopping_list WHERE item_id =$1 AND uid =$2 RETURNING *`,[
        id, req.user.id
      ]);
    if(deletedItem.rows.length===0){
      return res.json('You are trying to delete an item not in your list')
    }
    const msg = {"you just deleted": deletedItem.rows[0].item}
    res.json(msg)
  } catch (error) {
    console.error(error.message);
    res.json('delete error')
  }
})

module.exports = router;