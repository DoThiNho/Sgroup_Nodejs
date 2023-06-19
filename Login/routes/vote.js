const db = require('../database/knex-connection')
const express = require('express');
const router = express.Router();
const { verifyToken,verifyTokenAndAuthorization} = require('./verifyToken')

router.post("/polls", verifyToken, async (req, res) => {
    try {
      if(req.user.isAdmin) {
        const { voteTitle, voteQuestion, options } = req.body;
        const poll = {
            voteTitle, 
            voteQuestion, 
            createdAt: new Date(Date.now()),
            createBy: req.user.id,
        }
        const existingPoll = await db('polls').where('voteTitle', voteTitle).first();
        if(existingPoll) {
            return res.status(400).json( {
                message: 'Poll already exists'
            })
        }
        await db.insert(poll).into('polls')
        options.forEach(async (option) => {
            const voteOption = {
                voteOption: option.voteOption,
                count: option.count,
                voteId: option.voteId
            };
            console.log(voteOption);
            await db.insert(voteOption).into('options');
        });
        return res.status(200).json({
            message: 'Register successfully'
        })
      }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        message: 'Internal server error',
        });
    }
})

router.put("/polls/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params;
    const poll = {
        voteTitle: req.body.voteTitle,
        voteQuestion: req.body.voteQuestion
    }
    try {
        // Kiểm tra xem Poll có tồn tại hay không
        const existingPoll = await db('polls').where('id', id).first();
        if (!existingPoll) {
          return res.status(404).json({ message: 'Poll not found' });
        }
    
        // Cập nhật thông tin mới cho Poll
        await db('polls').where('id', id).update(poll);
    
        res.status(200).json({ message: 'Poll updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
})

router.put("/options/:optionId", async (req, res) => {
    try {
      const optionId = req.params.optionId;
      const { voteOption, count } = req.body;
  
      // Kiểm tra xem option có tồn tại hay không
      const existingOption = await db('options').where('id', optionId).first();
      if (!existingOption) {
        return res.status(404).json({
          message: 'Option not found',
        });
      }
  
      // Cập nhật thông tin của option
      await db('options').where('id', optionId).update({
        voteOption,
        count,
      });
  
      return res.status(200).json({
        message: 'Option updated successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
});

router.delete("/polls/:pollId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const pollId = req.params.pollId;
  
      // Kiểm tra xem poll có tồn tại hay không
      const existingPoll = await db("polls").where("id", pollId).first();
      if (!existingPoll) {
        return res.status(404).json({
          message: "Poll not found",
        });
      }
  
      // Xóa các option liên quan trong bảng "options"
      await db("options").where("voteId", pollId).del();
      
      // Xóa poll từ bảng "polls"
      await db("polls").where("id", pollId).del();

      return res.status(200).json({
        message: "Poll deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });
  
  router.get("/polls/:pollId", async (req, res) => {
    try {
      const pollId = req.params.pollId;
  
      // Lấy thông tin của poll từ bảng "polls"
      const poll = await db("polls").where("id", pollId).first();
      if (!poll) {
        return res.status(404).json({
          message: "Poll not found",
        });
      }
  
      // Lấy danh sách options liên quan từ bảng "options"
      const options = await db("options").where("voteId", pollId);
  
      // Kết hợp thông tin poll và options thành một đối tượng response
      const pollDetails = {
        id: poll.id,
        voteTitle: poll.voteTitle,
        voteQuestion: poll.voteQuestion,
        createBy: poll.createBy,
        options: options.map((option) => ({
          id: option.id,
          voteOption: option.voteOption,
          count: option.count,
        })),
      };
  
      return res.status(200).json(pollDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
});


router.post("/polls/:pollId/options/:optionId/submit", async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const optionId = req.params.optionId;

    // Kiểm tra xem poll tồn tại hay không
    const poll = await db("polls").where("id", pollId).first();
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Kiểm tra xem option tồn tại hay không
    const option = await db("options").where("id", optionId).first();
    if (!option) {
      return res.status(404).json({
        message: "Option not found",
      });
    }

    // Gửi option bằng cách tăng giá trị count lên 1
    await db("options")
      .where("id", optionId)
      .increment("count", 1);

    return res.status(200).json({
      message: "Option submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


router.post("/polls/:pollId/options/:optionId/unsubmit", async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const optionId = req.params.optionId;

    // Kiểm tra xem poll tồn tại hay không
    const poll = await db("polls").where("id", pollId).first();
    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Kiểm tra xem option tồn tại hay không
    const option = await db("options").where("id", optionId).first();
    if (!option) {
      return res.status(404).json({
        message: "Option not found",
      });
    }

    // Hủy gửi option bằng cách giảm giá trị count xuống 1 (nếu count > 0)
    if (option.count > 0) {
      await db("options")
        .where("id", optionId)
        .decrement("count", 1);
    }

    return res.status(200).json({
      message: "Option unsubmitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


module.exports = router;