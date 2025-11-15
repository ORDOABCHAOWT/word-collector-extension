// 获取当前标签页
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// 更新统计信息和状态
async function updateStats() {
  // 获取存储的词句和状态
  chrome.storage.local.get(['phrases', 'isEnabled'], function(result) {
    const phrases = result.phrases || [];
    const isEnabled = result.isEnabled === true;
    
    document.getElementById('phraseCount').textContent = phrases.length;
    
    // 更新开关状态
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('statusText');
    
    toggleSwitch.checked = isEnabled;
    if (isEnabled) {
      statusText.textContent = '已启用';
      statusText.classList.add('enabled');
    } else {
      statusText.textContent = '已关闭';
      statusText.classList.remove('enabled');
    }
  });
  
  // 获取当前页面信息
  try {
    const tab = await getCurrentTab();
    if (tab && tab.url) {
      const hostname = new URL(tab.url).hostname;
      document.getElementById('currentPage').textContent = hostname;
    }
  } catch (e) {
    document.getElementById('currentPage').textContent = '未知';
  }
}

// 开关切换
document.getElementById('toggleSwitch').addEventListener('change', async function() {
  const isEnabled = this.checked;
  const statusText = document.getElementById('statusText');
  
  try {
    const tab = await getCurrentTab();
    
    chrome.tabs.sendMessage(tab.id, { 
      action: 'toggleExtension', 
      enabled: isEnabled 
    }, function(response) {
      if (chrome.runtime.lastError) {
        alert('请刷新页面后再试！\n' + chrome.runtime.lastError.message);
        // 恢复开关状态
        document.getElementById('toggleSwitch').checked = !isEnabled;
      } else {
        // 更新状态显示
        if (isEnabled) {
          statusText.textContent = '已启用';
          statusText.classList.add('enabled');
        } else {
          statusText.textContent = '已关闭';
          statusText.classList.remove('enabled');
        }
      }
    });
  } catch (error) {
    alert('切换失败：' + error.message);
    this.checked = !isEnabled;
  }
});

// 显示浮窗
document.getElementById('showWindowBtn').addEventListener('click', async function() {
  try {
    const tab = await getCurrentTab();
    
    chrome.tabs.sendMessage(tab.id, { action: 'showWindow' }, function(response) {
      if (chrome.runtime.lastError) {
        alert('请刷新页面后再试！\n错误：' + chrome.runtime.lastError.message);
      } else if (response && !response.success) {
        alert('请先启用插件！');
      } else {
        window.close();
      }
    });
  } catch (error) {
    alert('显示浮窗失败：' + error.message);
  }
});

// 导出词句 - 复制到剪贴板
document.getElementById('exportBtn').addEventListener('click', function() {
  chrome.storage.local.get(['phrases'], function(result) {
    const phrases = result.phrases || [];
    
    if (phrases.length === 0) {
      alert('没有可导出的内容');
      return;
    }
    
    // 生成导出文本
    const text = phrases.map((phrase, index) => {
      const date = new Date(phrase.timestamp);
      return `${index + 1}. ${phrase.text}\n来源: ${phrase.url}\n时间: ${date.toLocaleString('zh-CN')}\n`;
    }).join('\n---\n\n');
    
    // 复制到剪贴板
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ 已复制 ${phrases.length} 条词句到剪贴板！\n\n现在可以直接粘贴到备忘录了`);
    }).catch(err => {
      // 如果新API失败，使用旧方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert(`✅ 已复制 ${phrases.length} 条词句到剪贴板！\n\n现在可以直接粘贴到备忘录了`);
      } catch (err) {
        alert('❌ 复制失败: ' + err.message);
      }
      document.body.removeChild(textArea);
    });
  });
});

// 清空所有词句
document.getElementById('clearBtn').addEventListener('click', async function() {
  if (!confirm('确定要清空所有收集的词句吗？此操作不可恢复！')) {
    return;
  }
  
  try {
    // 清空存储
    chrome.storage.local.set({ phrases: [] }, async function() {
      // 通知content script清除高亮
      const tab = await getCurrentTab();
      
      chrome.tabs.sendMessage(tab.id, { action: 'clearHighlights' }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('无法清除高亮：', chrome.runtime.lastError.message);
        }
      });
      
      updateStats();
      alert('✅ 已清空所有词句！');
    });
  } catch (error) {
    alert('清空失败：' + error.message);
  }
});

// 页面加载时更新统计信息
updateStats();
